import { Router } from "express";
import { getUnreadContacts, markAsRead, getAllContacts, deleteContact, replyToContact, updateContactStatus } from "../controllers/admin/contactController.js";
import { requireAuth, requireRoles, requireAdminPermission } from "../middleware/authMiddleware.js";

export const contactRouter = Router();

contactRouter.use(requireAuth, requireRoles(["ADMIN", "SUPER_ADMIN"]));

contactRouter.get("/unread", requireAdminPermission("contacts", "view"), getUnreadContacts);
contactRouter.get("/all", requireAdminPermission("contacts", "view"), getAllContacts);
contactRouter.put("/:id/read", requireAdminPermission("contacts", "view"), markAsRead);
contactRouter.delete("/:id", requireAdminPermission("contacts", "delete"), deleteContact);
contactRouter.post("/:id/reply", replyToContact);
contactRouter.put("/:id/status", requireAdminPermission("contacts", "changeStatus"), updateContactStatus);
