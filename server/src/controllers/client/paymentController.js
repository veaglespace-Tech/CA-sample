import { prisma } from "../../config/db.js";
import {
  getPayuConfig,
  generatePayuHash,
  verifyPayuHash,
  generateTxnId,
} from "../../services/payu.js";
import { buildPaymentRewardPreview, markCompletedForPayingReferredUser } from "../../services/referrals.js";
import { ensureUserAccountForLead } from "../../services/registrations.js";

function parseLeadMetadata(metadata) {
  if (!metadata) return {};
  if (typeof metadata === "object") return metadata;
  try { return JSON.parse(metadata); } catch { return {}; }
}

function getEnv(key, fallback = "") {
  return (process.env[key] || fallback).trim();
}

function getServerUrl() {
  return getEnv(
    "SERVER_URL",
    getEnv("SERVER_BASE_URL", `http://localhost:${getEnv("PORT", "5003")}`),
  );
}

function getClientUrl() {
  return getEnv(
    "CLIENT_URL",
    getEnv("FRONTEND_ORIGIN", "http://localhost:3003"),
  );
}

function toPayuAmount(value) {
  return Number.parseFloat(value).toFixed(2);
}

/**
 * POST /api/payment/initiate
 * Body: { leadId, amount (optional override) }
 * Returns PayU form params for the client to POST to PayU gateway
 */
export async function initiatePayuPayment(req, res) {
  try {
    const {
      leadId,
      planId: requestedPlanId,
      planName: requestedPlanName,
      amount: requestedAmount,
    } = req.body;
    if (!leadId) {
      return res.status(400).json({ ok: false, error: "leadId is required" });
    }

    const user = req.user;
    const userId = user?.id || null;
    const { key, salt, baseUrl } = getPayuConfig();

    if (!key || !salt) {
      return res.status(500).json({ ok: false, error: "Payment gateway is not configured. Please contact support." });
    }

    // Resolve lead (RegistrationLead or Lead)
    let lead = await prisma.registrationLead.findUnique({
      where: { id: leadId },
      include: { service: true, user: true },
    });

    let isRegistrationLead = true;
    if (!lead) {
      lead = await prisma.lead.findUnique({
        where: { id: leadId },
        include: { service: true, user: true },
      });
      isRegistrationLead = false;
    }

    if (!lead) {
      return res.status(404).json({ ok: false, error: "Lead not found." });
    }

    const bodyPlanId = typeof requestedPlanId === "string" ? requestedPlanId.trim() : "";
    const bodyPlanName = typeof requestedPlanName === "string" ? requestedPlanName.trim() : "";
    const bodyAmount = typeof requestedAmount === "string" || typeof requestedAmount === "number"
      ? String(requestedAmount).replace(/[^0-9.]/g, "")
      : "";

    const metadataPlanId = (() => {
      const meta = parseLeadMetadata(lead.metadata);
      return typeof meta.selectedPlanId === "string" ? meta.selectedPlanId.trim() : "";
    })();

    let resolvedPlan = null;
    const planLookupId = bodyPlanId || metadataPlanId;
    if (planLookupId) {
      resolvedPlan = await prisma.purchasePlan.findUnique({
        where: { id: planLookupId },
        select: { id: true, name: true, price: true, serviceId: true, serviceSlug: true, isActive: true },
      });
    }

    const meta = parseLeadMetadata(lead.metadata);

    let amountStr = null;
    let planName = meta.selectedPlanName || bodyPlanName || "Professional Service";

    if (resolvedPlan) {
      if (resolvedPlan.isActive === false) {
        return res.status(400).json({ ok: false, error: "Selected plan is no longer active. Please choose another plan." });
      }

      const planAmount = String(resolvedPlan.price || "").replace(/[^0-9.]/g, "");
      if (!planAmount || isNaN(parseFloat(planAmount))) {
        return res.status(400).json({ ok: false, error: "Only fixed-price plans can be paid online." });
      }

      if (lead.service?.id && resolvedPlan.serviceId && resolvedPlan.serviceId !== lead.service.id) {
        return res.status(400).json({ ok: false, error: "Selected plan does not match this lead." });
      }

      if (lead.service?.slug && resolvedPlan.serviceSlug && normalizedSlugMismatch(lead.service.slug, resolvedPlan.serviceSlug)) {
        return res.status(400).json({ ok: false, error: "Selected plan does not match this lead." });
      }

      amountStr = planAmount;
      planName = resolvedPlan.name || planName;
    } else if (parseLeadMetadata(lead.metadata)?.selectedPlanAmount !== undefined) {
      const metadataAmount = String(parseLeadMetadata(lead.metadata).selectedPlanAmount).replace(/[^0-9.]/g, "");
      if (metadataAmount && !isNaN(parseFloat(metadataAmount))) {
        amountStr = metadataAmount;
      }
    } else if (bodyAmount && !isNaN(parseFloat(bodyAmount))) {
      amountStr = bodyAmount;
    } else if (meta.selectedPlanPrice) {
      amountStr = String(meta.selectedPlanPrice).replace(/[^0-9.]/g, "");
    }

    if (!amountStr || isNaN(parseFloat(amountStr))) {
      return res.status(400).json({
        ok: false,
        error: "No valid payment amount found for this lead. Please contact support.",
      });
    }

    // Apply referral reward if eligible
    const rewardPreview = userId
      ? await buildPaymentRewardPreview({ userId, amount: amountStr })
      : null;
    const taxableAmount = rewardPreview?.eligible
      ? Number.parseFloat(rewardPreview.finalAmount)
      : Number.parseFloat(amountStr);
    const gstAmount = taxableAmount * 0.18;
    const finalAmount = toPayuAmount(taxableAmount + gstAmount);

    const serviceName = lead.service?.name || lead.serviceName || "ValueXpert Service";
    const productinfo = `${serviceName} - ${planName}`.slice(0, 100);

    const txnid = generateTxnId(leadId);
    const firstname = (user?.name || lead.fullName || "Customer").split(" ")[0];
    const email = user?.email || lead.email || "";
    const phone = user?.phone || lead.phone || "";

    // udf1 = leadId, udf2 = isRegistrationLead flag, udf3 = userId
    const udf1 = leadId;
    const udf2 = isRegistrationLead ? "reg" : "lead";
    const udf3 = userId || "";
    const udf4 = JSON.stringify({
      settingId: rewardPreview?.eligible ? rewardPreview.setting?.id : undefined,
      discountPercent: rewardPreview?.eligible ? rewardPreview.discountPercent : 0,
      discountAmount: rewardPreview?.eligible ? rewardPreview.discountAmount : 0,
      originalAmount: amountStr,
      taxableAmount: toPayuAmount(taxableAmount),
      gstAmount: toPayuAmount(gstAmount),
    });
    const udf5 = "";

    const hash = generatePayuHash({
      key, txnid, amount: finalAmount, productinfo,
      firstname, email, udf1, udf2, udf3, udf4, udf5, salt,
    });

    const clientUrl = getClientUrl();

    // Store txnid in DB
    await prisma.paymentRecord.create({
      data: {
        [isRegistrationLead ? "registrationId" : "leadId"]: leadId,
        userId: userId,
        customerName: user?.name || lead.fullName || "Customer",
        customerEmail: email,
        customerPhone: phone,
        serviceName: productinfo,
        amount: finalAmount,
        status: `PENDING_PAYU:${txnid}`,
      },
    });

    return res.status(200).json({
      ok: true,
      data: {
        payuBaseUrl: baseUrl,
        params: {
          key,
          txnid,
          amount: finalAmount,
          productinfo,
          firstname,
          email,
          phone,
          udf1,
          udf2,
          udf3,
          udf4,
          udf5,
          hash,
          // ✅ surl/furl → SERVER endpoints (PayU POSTs form data here, server then redirects to client)
          surl: `${getServerUrl()}/api/payment/success`,
          furl: `${getServerUrl()}/api/payment/failure`,
        },
        rewardPreview: rewardPreview?.eligible ? rewardPreview : null,
      },
    });
  } catch (error) {
    console.error("[paymentController] initiatePayuPayment error:", error);
    return res.status(500).json({ ok: false, error: "Failed to initiate payment." });
  }
}

function normalizedSlugMismatch(left, right) {
  const normalize = (value = "") =>
    String(value)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  return normalize(left) !== normalize(right);
}

/**
 * POST /api/payment/webhook  (PayU server-to-server callback)
 */
export async function handlePayuWebhook(req, res) {
  try {
    const params = req.body;
    const { status, txnid, udf1: leadId, udf2: leadType, udf3: userId, udf4: rewardJson } = params;

    if (!verifyPayuHash(params)) {
      console.warn("[PayU Webhook] Hash verification FAILED for txnid:", txnid);
      return res.status(200).send("HASH_MISMATCH");
    }

    await processPayuCallback({ status, txnid, leadId, leadType, userId, rewardJson, params });
    return res.status(200).send("OK");
  } catch (error) {
    console.error("[PayU Webhook] Error:", error);
    return res.status(200).send("ERROR");
  }
}

/**
 * POST /api/payment/success  (PayU redirect after success)
 */
export async function handlePayuSuccess(req, res) {
  try {
    const params = req.body;
    const { txnid, udf1: leadId, udf2: leadType, udf3: userId, udf4: rewardJson } = params;
    const clientUrl = getClientUrl();

    if (!verifyPayuHash(params)) {
      console.warn("[PayU Success] Hash verification FAILED for txnid:", txnid);
      return res.redirect(`${clientUrl}/payment/failure?reason=hash_mismatch&txnid=${txnid}`);
    }

    await processPayuCallback({ status: "success", txnid, leadId, leadType, userId, rewardJson, params });
    return res.redirect(`${clientUrl}/payment/success?txnid=${txnid}&leadId=${leadId}`);
  } catch (error) {
    console.error("[PayU Success] Error:", error);
    const clientUrl = getClientUrl();
    return res.redirect(`${clientUrl}/payment/failure?reason=server_error`);
  }
}

/**
 * POST /api/payment/failure  (PayU redirect after failure)
 */
export async function handlePayuFailure(req, res) {
  const params = req.body;
  const { txnid, udf1: leadId } = params;
  const clientUrl = getClientUrl();

  try {
    if (txnid) {
      await prisma.paymentRecord.updateMany({
        where: { status: `PENDING_PAYU:${txnid}` },
        data: { status: "FAILED" },
      });
    }
  } catch (e) {
    console.error("[PayU Failure] DB update error:", e);
  }

  return res.redirect(`${clientUrl}/payment/failure?txnid=${txnid}&leadId=${leadId}`);
}

/**
 * GET /api/payment/status/:leadId
 */
export async function getPaymentStatus(req, res) {
  try {
    const { leadId } = req.params;

    const payment = await prisma.paymentRecord.findFirst({
      where: {
        OR: [
          { registrationId: leadId },
          { leadId: leadId },
        ],
      },
      orderBy: { createdAt: "desc" },
    });

    if (!payment) {
      return res.status(404).json({ ok: false, error: "No payment record found." });
    }

    return res.status(200).json({ ok: true, data: payment });
  } catch (error) {
    console.error("[paymentController] getPaymentStatus error:", error);
    return res.status(500).json({ ok: false, error: "Failed to fetch payment status." });
  }
}

/**
 * Internal: process a successful PayU callback (used by webhook + success redirect)
 */
async function processPayuCallback({ status, txnid, leadId, leadType, userId, rewardJson, params }) {
  console.log(`[DEBUG] processPayuCallback started for txnid: ${txnid}, leadId: ${leadId}`);
  const isSuccess = String(status).toLowerCase() === "success";
  const pendingStatus = `PENDING_PAYU:${txnid}`;
  console.log(`[DEBUG] Looking for pending payment with status: ${pendingStatus}`);
  const pendingPayment = await prisma.paymentRecord.findFirst({
    where: { status: pendingStatus },
    orderBy: { createdAt: "desc" },
  });

  if (!isSuccess) {
    await prisma.paymentRecord.updateMany({
      where: { status: pendingStatus },
      data: { status: "FAILED" },
    });
    return;
  }

  if (!pendingPayment) {
    console.warn("[PayU Callback] No pending payment found for txnid:", txnid);
    return;
  }

  const amount = params.amount || params.net_amount_debit || "0";
  const isRegistrationLead = leadType === "reg";

  // Parse reward info
  let rewardData = null;
  try { rewardData = rewardJson ? JSON.parse(rewardJson) : null; } catch { rewardData = null; }

  // Update payment record
  const result = await prisma.paymentRecord.updateMany({
    where: { id: pendingPayment.id },
    data: {
      status: "SUCCESS",
      amount: String(amount),
    },
  });

  console.log(`[DEBUG] Update pending payment result count: ${result.count}`);
  if (result.count === 0) return;

  console.log(`[DEBUG] Marking lead as CONVERTED...`);

  // Mark lead as CONVERTED
  if (isRegistrationLead) {
    await prisma.registrationLead.updateMany({
      where: { id: leadId },
      data: { status: "CONVERTED" },
    });
  } else {
    await prisma.lead.updateMany({
      where: { id: leadId },
      data: { status: "CONVERTED" },
    });
  }

  // Create referral reward redemption if applicable
  if (rewardData && userId && rewardData.settingId) {
    const existing = await prisma.referralRewardRedemption.findFirst({
      where: { paymentRecordId: pendingPayment.id },
    });
    if (!existing) {
      await prisma.referralRewardRedemption.create({
        data: {
          userId,
          rewardSettingId: rewardData.settingId,
          paymentRecordId: pendingPayment.id,
          discountPercent: rewardData.discountPercent || 0,
          discountAmount: String(rewardData.discountAmount || 0),
          originalAmount: String(rewardData.originalAmount || amount),
          finalAmount: String(amount),
        },
      }).catch((e) => console.warn("[Reward Redemption] skipped:", e.message));
    }

    // Mark referrals complete
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (user) await markCompletedForPayingReferredUser(user);
  }
  
  console.log(`[DEBUG] Fetching updated payment & lead for ensureUserAccountForLead...`);
  const updatedPayment = await prisma.paymentRecord.findUnique({ where: { id: pendingPayment.id } });
  let lead = await prisma.registrationLead.findUnique({ where: { id: leadId }, include: { service: true, user: true } });
  if (!lead) {
    lead = await prisma.lead.findUnique({ where: { id: leadId }, include: { service: true, user: true } });
  }
  
  if (lead && updatedPayment) {
    console.log(`[DEBUG] Calling ensureUserAccountForLead...`);
    await ensureUserAccountForLead(lead, isRegistrationLead, "payment", updatedPayment).catch(err => {
      console.error("[PayU Callback] Error ensuring user account/sending invoice:", err);
    });
    console.log(`[DEBUG] ensureUserAccountForLead finished in callback.`);
  } else {
    console.log(`[DEBUG] Missing lead or updatedPayment. lead: ${!!lead}, updatedPayment: ${!!updatedPayment}`);
  }
}
