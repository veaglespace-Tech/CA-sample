import { Router } from "express";
import { requireAuth, requireRoles, requireAdminPermission } from "../middleware/authMiddleware.js";
import { createReferral, getMyReferrals, previewPaymentReward, updateReferralStatus, updateRewardSetting } from "../controllers/public/referralController.js";

export const referralRouter = Router();

// Public form submissions (e.g. from public website)
referralRouter.post("/referrals", createReferral);

// Logged-in user's personalized referral tracking log
referralRouter.get("/my-referrals", requireAuth, getMyReferrals);
referralRouter.get("/referral-rewards/payment-preview", previewPaymentReward);

// Administrative rewards qualification & status overrides
referralRouter.put("/admin/referrals/:id/status", requireAuth, requireRoles(["ADMIN", "SUPER_ADMIN"]), requireAdminPermission("referrals", "changeStatus"), updateReferralStatus);
referralRouter.post("/admin/referral-rewards", requireAuth, requireRoles(["ADMIN", "SUPER_ADMIN"]), requireAdminPermission("referrals", "setReward"), updateRewardSetting);
