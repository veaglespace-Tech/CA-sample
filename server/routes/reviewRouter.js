import { Router } from "express";
import { requireAuth, requireRoles } from "../middleware/authMiddleware.js";
import { upload } from "../utils/multer.js";
import * as reviewCtrl from "../controllers/admin/reviewController.js";

export const reviewRouter = Router();

// ── Public endpoints (no auth needed) ──────────────────────────
reviewRouter.get("/reviews", reviewCtrl.getPublicReviews);

// ── Admin endpoints ──────────────────────────────────────────────
reviewRouter.get(
  "/admin/reviews",
  requireAuth,
  requireRoles(["ADMIN", "SUPER_ADMIN"]),
  reviewCtrl.getAllReviews
);
reviewRouter.post(
  "/admin/reviews",
  requireAuth,
  requireRoles(["ADMIN", "SUPER_ADMIN"]),
  upload.single("image"),
  reviewCtrl.createReview
);
reviewRouter.put(
  "/admin/reviews/:id",
  requireAuth,
  requireRoles(["ADMIN", "SUPER_ADMIN"]),
  upload.single("image"),
  reviewCtrl.updateReview
);
reviewRouter.delete(
  "/admin/reviews/:id",
  requireAuth,
  requireRoles(["ADMIN", "SUPER_ADMIN"]),
  reviewCtrl.deleteReview
);
