import { Router } from "express";
import { requireAuth, requireRoles, requireAdminPermission } from "../middleware/authMiddleware.js";
import { subscribeNewsletter, getNewsletterSubscribers } from "../controllers/public/newsletterController.js";
import { validateNewsletterBody } from "../middleware/validateRequest.js";

export const newsletterRouter = Router();

newsletterRouter.post("/subscribe", validateNewsletterBody, subscribeNewsletter);
newsletterRouter.get("/subscribers", requireAuth, requireRoles(["ADMIN", "SUPER_ADMIN"]), requireAdminPermission("newsletter", "view"), getNewsletterSubscribers);
