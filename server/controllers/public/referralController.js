import * as referralsService from "../../services/referrals.js";
import { prisma } from "../../config/db.js";

/**
 * Handles public form submissions for manual referrals.
 */
export async function createReferral(req, res) {
  try {
    const referral = await referralsService.insertReferral(req.body);
    res.status(201).json({ ok: true, data: referral });
  } catch (error) {
    if (error.message.includes("required")) return res.status(400).json({ ok: false, error: error.message });
    res.status(500).json({ ok: false, error: "Failed to create referral" });
  }
}

/**
 * Retrieves the logged-in user's personalized referral history.
 */
export async function getMyReferrals(req, res) {
  try {
    const user = req.user;
    if (!user) {
      return res.status(401).json({ ok: false, error: "Unauthorized" });
    }
    const [referrals, rewardSummary] = await Promise.all([
      referralsService.fetchUserReferrals(user),
      referralsService.getRewardSummaryForUser(user.id),
    ]);
    res.status(200).json({ ok: true, data: referrals, rewardSummary });
  } catch (error) {
    console.error("Failed to fetch user referrals:", error);
    res.status(500).json({ ok: false, error: "Failed to fetch referrals" });
  }
}

export async function previewPaymentReward(req, res) {
  try {
    const { leadId, amount } = req.query;
    let userId = req.user?.id;
    let previewAmount = amount;

    if (leadId) {
      const [registrationLead, lead] = await Promise.all([
        prisma.registrationLead.findUnique({ where: { id: leadId }, select: { userId: true, metadata: true } }),
        prisma.lead.findUnique({ where: { id: leadId }, select: { userId: true, metadata: true } }),
      ]);
      const item = registrationLead || lead;
      userId = item?.userId || userId;
      if (!previewAmount && item?.metadata) {
        let meta = {};
        try {
          meta = typeof item.metadata === "string" ? JSON.parse(item.metadata || "{}") : item.metadata;
        } catch {}
        previewAmount = meta?.selectedPlanPrice;
      }
    }

    const preview = await referralsService.buildPaymentRewardPreview({ userId, amount: previewAmount });
    res.status(200).json({ ok: true, data: preview });
  } catch (error) {
    console.error("Failed to preview referral reward:", error);
    res.status(500).json({ ok: false, error: "Failed to preview referral reward" });
  }
}

/**
 * Handles administrative status overrides and bonus qualification.
 */
export async function updateReferralStatus(req, res) {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const referral = await referralsService.updateStatus(id, status);
    res.status(200).json({ ok: true, data: referral });
  } catch (error) {
    console.error("Failed to update referral status:", error);
    res.status(500).json({ ok: false, message: error.message || "Failed to update referral status." });
  }
}

export async function updateRewardSetting(req, res) {
  try {
    const setting = await referralsService.saveRewardSetting(req.body || {});
    res.status(200).json({ ok: true, data: setting });
  } catch (error) {
    res.status(400).json({ ok: false, message: error.message || "Failed to save referral reward." });
  }
}
