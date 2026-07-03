import { prisma } from "../config/db.js";
import { normalizePhone, optionalString, requireString } from "../utils/core.js";
import { alertNewRegistration } from "./adminAlerts.js";
import { resolveServiceId } from "./leads.js";
import { buildPaymentRewardPreview, markCompletedForPayingReferredUser } from "./referrals.js";
import { generateInvoicePdf } from "../utils/pdfGenerator.js";
import { getPaymentSuccessEmailHtml } from "../utils/emailTemplates.js";
import bcrypt from "bcryptjs";
import { sendEmail } from "../utils/mailer.js";
import fs from "fs";

function getEnv(key, fallback = "") {
  return (process.env[key] || fallback).trim();
}

function logToFile(msg) {
  try {
    fs.appendFileSync("debug_auth.log", new Date().toISOString() + " - " + msg + "\n");
  } catch (e) {}
}

export async function insertRegistrationLead(data, meta, options) {
  const fullName = requireString(data, ["fullName", "name"], "Full name");
  const phone = normalizePhone(requireString(data, ["phone", "mobile", "mobileNumber"], "Phone"));
  const registrationType = optionalString(data.registrationType) || "OTHER";
  const serviceName = optionalString(data.serviceName) || optionalString(data.service) || optionalString(data.serviceInterestedIn);
  const serviceId = await resolveServiceId(serviceName, data.serviceSlug);

  const lead = await prisma.registrationLead.create({
    data: {
      fullName,
      phone,
      email: optionalString(data.email),
      city: optionalString(data.city),
      businessName: optionalString(data.businessName),
      mainCategory: optionalString(data.mainCategory),
      registrationType,
      message: optionalString(data.message),
      source: options.source || "WEBSITE",
      formType: options.formType || "REGISTRATION",
      sourcePageSlug: data.serviceSlug || serviceName,
      utmSource: optionalString(data.utmSource),
      utmMedium: optionalString(data.utmMedium),
      utmCampaign: optionalString(data.utmCampaign),
      ipAddress: meta.ipAddress,
      userAgent: meta.userAgent,
      state: optionalString(data.state),
      pinCode: optionalString(data.pinCode),
      natureOfBusiness: optionalString(data.natureOfBusiness),
      address: optionalString(data.address),
      metadata: data.metadata && typeof data.metadata === "object" ? JSON.stringify(data.metadata) : undefined,
      serviceId,
      userId: options.userId || undefined,
    },
    include: { service: { select: { name: true, slug: true } } },
  });

  console.log("Checking custom plan. Metadata is:", data.metadata);
  if (data.metadata?.selectedPlanName === "Custom Plan") {
    console.log("It IS a custom plan! Attempting to create PaymentRecord...");
    try {
      await prisma.paymentRecord.create({
        data: {
          registrationId: lead.id,
          userId: lead.userId || undefined,
          serviceName: serviceName || "Custom Service Request",
          amount: "Custom Quote",
          status: "UNPAID (Custom Plan)",
          customerName: fullName,
          customerEmail: optionalString(data.email),
          customerPhone: phone,
        }
      });
      console.log("PaymentRecord created successfully!");
    } catch (err) {
      console.error("Failed to create custom plan payment record:", err);
      throw err;
    }
  }

  // Send admin notification
  await alertNewRegistration(lead);

  return lead;
}

export async function updateRegistrationNextStep(id, additionalData) {
  // 1. Try updating in RegistrationLead table
  const lead = await prisma.registrationLead.findUnique({ where: { id } });
  if (lead) {
    let existingMetadata = {};
    try { existingMetadata = typeof lead.metadata === 'string' ? JSON.parse(lead.metadata) : (lead.metadata || {}); } catch(e) {}
    const newMetadata = additionalData.metadata && typeof additionalData.metadata === 'object' ? additionalData.metadata : {};

    return prisma.registrationLead.update({
      where: { id },
      data: {
        city: optionalString(additionalData.city) || lead.city,
        businessName: optionalString(additionalData.businessName) || lead.businessName,
        state: optionalString(additionalData.state) || optionalString(newMetadata.state) || lead.state,
        pinCode: optionalString(additionalData.pinCode) || optionalString(newMetadata.pinCode) || lead.pinCode,
        natureOfBusiness: optionalString(additionalData.natureOfBusiness) || optionalString(newMetadata.natureOfBusiness) || lead.natureOfBusiness,
        address: optionalString(additionalData.address) || optionalString(additionalData.completeAddress) || optionalString(newMetadata.address) || lead.address,
        message: optionalString(additionalData.message) || lead.message,
        metadata: Object.keys(newMetadata).length > 0 ? JSON.stringify({ ...existingMetadata, ...newMetadata }) : lead.metadata,
        status: "IN_PROGRESS",
      }
    });
  }

  // 2. Fallback to standard Lead table (store extra fields like state/pinCode in metadata JSON)
  const standardLead = await prisma.lead.findUnique({ where: { id } });
  if (standardLead) {
    let existingMetadata = {};
    try { existingMetadata = typeof standardLead.metadata === 'string' ? JSON.parse(standardLead.metadata) : (standardLead.metadata || {}); } catch(e) {}
    const newMetadata = additionalData.metadata && typeof additionalData.metadata === 'object' ? additionalData.metadata : {};

    const mergedMetadata = {
      ...existingMetadata,
      ...newMetadata,
      address: additionalData.address || additionalData.completeAddress || existingMetadata.address,
      natureOfBusiness: additionalData.natureOfBusiness || existingMetadata.natureOfBusiness,
      pinCode: additionalData.pinCode || existingMetadata.pinCode,
      state: additionalData.state || existingMetadata.state,
    };

    return prisma.lead.update({
      where: { id },
      data: {
        city: optionalString(additionalData.city) || standardLead.city,
        businessName: optionalString(additionalData.businessName) || standardLead.businessName,
        message: optionalString(additionalData.message) || standardLead.message,
        metadata: JSON.stringify(mergedMetadata),
        status: "IN_PROGRESS",
      }
    });
  }

  throw new Error("Lead or Registration lead not found");
}

async function completePendingPaymentOrCreate(where, data, rewardPreview) {
  const paymentData = {
    ...data,
    amount: rewardPreview?.eligible ? String(rewardPreview.finalAmount) : data.amount,
    status: "SUCCESS",
  };

  let payment = await prisma.paymentRecord.findFirst({
    where: {
      ...where,
      status: { contains: "UNPAID" },
    },
    orderBy: { createdAt: "desc" },
  });

  if (payment) {
    payment = await prisma.paymentRecord.update({
      where: { id: payment.id },
      data: paymentData,
    });
  } else {
    payment = await prisma.paymentRecord.create({
      data: {
        ...where,
        ...paymentData,
      },
    });
  }

  if (rewardPreview?.eligible && data.userId) {
    await prisma.referralRewardRedemption.create({
      data: {
        userId: data.userId,
        rewardSettingId: rewardPreview.setting.id,
        paymentRecordId: payment.id,
        discountPercent: rewardPreview.discountPercent,
        discountAmount: String(rewardPreview.discountAmount),
        originalAmount: String(rewardPreview.originalAmount),
        finalAmount: String(rewardPreview.finalAmount),
      },
    });
  }

  return payment;
}

function parseLeadMetadata(metadata) {
  if (!metadata) return {};
  if (typeof metadata === "object") return metadata;
  try {
    return JSON.parse(metadata);
  } catch {
    return {};
  }
}

export async function ensureUserAccountForLead(lead, isRegistrationLead, stage = "payment", paymentRecord = null) {
  logToFile(`ensureUserAccountForLead started. leadId: ${lead.id}, stage: ${stage}`);
  console.log(`[DEBUG] ensureUserAccountForLead started. leadId: ${lead.id}, stage: ${stage}`);
  if (!lead.email) {
    logToFile(`No email on lead, returning userId: ${lead.userId}`);
    console.log(`[DEBUG] No email on lead, returning userId: ${lead.userId}`);
    return lead.userId;
  }

  let existingUser = await prisma.user.findUnique({ where: { email: lead.email } });
  let finalUserId = existingUser?.id;
  let isNewUser = false;
  let tempPassword = "";

  if (!existingUser) {
    logToFile(`User not found for ${lead.email}, creating new user.`);
    console.log(`[DEBUG] User not found for ${lead.email}, creating new user.`);
    isNewUser = true;
    tempPassword = Math.random().toString(36).slice(-8);
    const hashedPassword = await bcrypt.hash(tempPassword, 12);
    try {
      const newUser = await prisma.user.create({
        data: {
          name: lead.name || lead.fullName || "User",
          email: lead.email,
          phone: lead.phone || "0000000000",
          passwordHash: hashedPassword,
          role: "USER"
        }
      });
      finalUserId = newUser.id;
      existingUser = newUser;
      logToFile(`New user created with ID: ${finalUserId}`);
      console.log(`[DEBUG] New user created with ID: ${finalUserId}`);
    } catch (dbErr) {
      logToFile(`DB ERROR creating user: ${dbErr.message}`);
      throw dbErr;
    }
  } else if (!lead.userId) {
    logToFile(`Linking existing user ID ${existingUser.id} to lead.`);
    console.log(`[DEBUG] Linking existing user ID ${existingUser.id} to lead.`);
    finalUserId = existingUser.id;
  } else {
    finalUserId = lead.userId;
  }

  console.log(`[DEBUG] Checking stage... current stage is: ${stage}`);
  // Only send the email during the payment stage, as requested by the user.
  if (stage === "payment") {
    const serviceTitle = lead.service?.name || lead.serviceName || "Professional Service";
    const emailSubject = `Payment Successful - ${serviceTitle}`;
    
    const loginUrl = getEnv(
      "LOGIN_URL",
      `${getEnv("FRONTEND_ORIGIN", "http://localhost:3003")}/login`,
    );
    const htmlContent = getPaymentSuccessEmailHtml({
      userName: existingUser.name,
      serviceTitle,
      loginEmail: lead.email,
      tempPassword,
      loginUrl,
      isNewUser,
      leadName: lead.fullName || lead.name,
      leadPhone: lead.phone,
      paymentAmount: paymentRecord ? paymentRecord.amount : null,
    });

      let attachments = [];
      if (paymentRecord) {
        console.log(`[DEBUG] Generating PDF for paymentRecord ID: ${paymentRecord.id}`);
        try {
          const invoiceBuffer = await generateInvoicePdf(paymentRecord);
          attachments.push({
            filename: `Invoice_${paymentRecord.id}.pdf`,
            content: invoiceBuffer,
            contentType: 'application/pdf'
          });
          console.log(`[DEBUG] PDF generated successfully.`);
        } catch (err) {
          console.error("[DEBUG] Failed to generate invoice PDF:", err);
        }
      }

      console.log(`[DEBUG] Sending email to ${lead.email}...`);
      sendEmail({
        to: lead.email,
        subject: emailSubject,
        html: htmlContent,
        attachments
      }).then(() => console.log(`[DEBUG] Email successfully dispatched to ${lead.email}`))
        .catch(err => console.error("[DEBUG] Failed to send welcome/payment email:", err));
  }

  logToFile(`Updating lead.userId if changed... current: ${lead.userId}, final: ${finalUserId}`);
  console.log(`[DEBUG] Updating lead.userId if changed... current: ${lead.userId}, final: ${finalUserId}`);
  if (lead.userId !== finalUserId) {
    try {
      if (isRegistrationLead) {
        await prisma.registrationLead.update({ where: { id: lead.id }, data: { userId: finalUserId } });
      } else {
        await prisma.lead.update({ where: { id: lead.id }, data: { userId: finalUserId } });
      }
      logToFile(`Successfully updated lead ${lead.id} with userId ${finalUserId}`);
    } catch (updErr) {
      logToFile(`Error updating lead with userId: ${updErr.message}`);
    }
  }

  logToFile(`ensureUserAccountForLead complete. Returning ${finalUserId}`);
  console.log(`[DEBUG] ensureUserAccountForLead complete. Returning ${finalUserId}`);
  return finalUserId;
}

export async function updateRegistrationPayment(id) {
  // 1. Try updating in RegistrationLead table
  const lead = await prisma.registrationLead.findUnique({ where: { id }, include: { service: true, user: true } });
  if (lead) {
    const payment = await completePendingPaymentOrCreate(
      { registrationId: lead.id },
      {
        userId: lead.userId || null,
        customerName: lead.user?.name || lead.fullName,
        customerEmail: lead.user?.email || lead.email,
        customerPhone: lead.user?.phone || lead.phone,
        serviceName: (lead.service?.name || "Professional Service") + planName,
        amount: amountStr,
      },
      rewardPreview,
    );
    
    // Now that payment is created/updated, generate and send email
    lead.userId = await ensureUserAccountForLead(lead, true, "payment", payment);
    
    if (lead.user) await markCompletedForPayingReferredUser(lead.user);

    return prisma.registrationLead.update({
      where: { id },
      data: {
        status: "CONVERTED",
      }
    });
  }

  // 2. Fallback to standard Lead table
  const standardLead = await prisma.lead.findUnique({ where: { id }, include: { service: true, user: true } });
  if (standardLead) {
    standardLead.userId = await ensureUserAccountForLead(standardLead, false);
    let amountStr = "1769.00";
    let planName = "";
    if (standardLead.metadata) {
      const meta = parseLeadMetadata(standardLead.metadata);
      if (meta.selectedPlanPrice) {
        amountStr = String(meta.selectedPlanPrice).replace(/[^0-9.]/g, "");
      }
      if (meta.selectedPlanName) planName = ` - ${meta.selectedPlanName}`;
    }
    if (!amountStr || isNaN(parseFloat(amountStr))) amountStr = "1769.00";

    const rewardPreview = await buildPaymentRewardPreview({ userId: standardLead.userId, amount: amountStr });
    await completePendingPaymentOrCreate(
      { leadId: standardLead.id },
      {
        userId: standardLead.userId || null,
        customerName: standardLead.user?.name || standardLead.fullName,
        customerEmail: standardLead.user?.email || standardLead.email,
        customerPhone: standardLead.user?.phone || standardLead.phone,
        serviceName: (standardLead.service?.name || standardLead.serviceName || "Professional Service") + planName,
        amount: amountStr,
      },
      rewardPreview,
    );
    if (standardLead.user) await markCompletedForPayingReferredUser(standardLead.user);

    return prisma.lead.update({
      where: { id },
      data: {
        status: "CONVERTED",
      }
    });
  }

  throw new Error("Lead or Registration lead not found");
}

export async function updateRegistrationStatus(id, status) {
  const allowedStatuses = ["NEW", "IN_PROGRESS", "QUALIFIED", "CONVERTED", "COMPLETED", "REJECTED"];
  if (!allowedStatuses.includes(status)) throw new Error("Invalid status");

  // 1. Try RegistrationLead
  const lead = await prisma.registrationLead.findUnique({ where: { id } });
  if (lead) {
    return prisma.registrationLead.update({
      where: { id },
      data: { status },
    });
  }

  // 2. Try standard Lead
  const standardLead = await prisma.lead.findUnique({ where: { id } });
  if (standardLead) {
    return prisma.lead.update({
      where: { id },
      data: { status },
    });
  }

  throw new Error("Lead or Registration lead not found");
}
