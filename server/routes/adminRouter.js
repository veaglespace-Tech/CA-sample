import { Router } from "express";
import { requireAuth, requireRoles, requireAdminPermission } from "../middleware/authMiddleware.js";
import { upload } from "../utils/multer.js";
import * as adminCtrl from "../controllers/admin/adminController.js";
import * as userCtrl from "../controllers/admin/userController.js";
import * as eventCtrl from "../controllers/admin/eventController.js";
import * as repoCtrl from "../controllers/admin/repositoryController.js";
import * as articleCtrl from "../controllers/admin/articleController.js";
import * as documentCtrl from "../controllers/admin/documentController.js";
import * as permissionsCtrl from "../features/admin-permissions/controller.js";

export const adminRouter = Router();

// Global middleware for all admin routes
adminRouter.use(requireAuth, requireRoles(["ADMIN", "SUPER_ADMIN"]));

// Data Aggregation
adminRouter.get("/all-data", adminCtrl.getAllPlatformData);

// User Management (Delegated to userController)
adminRouter.post("/users", requireAdminPermission("users", "create"), userCtrl.createUser);
adminRouter.put("/users/:id", requireAdminPermission("users", "edit"), userCtrl.updateUser);
adminRouter.delete("/users/:id", requireAdminPermission("users", "delete"), userCtrl.deleteUser);
adminRouter.get("/users/search", requireAdminPermission("users", "view"), userCtrl.searchUsers);

// Event Management (Delegated to eventController)
adminRouter.post("/events", requireAdminPermission("events", "create"), upload.single("image"), eventCtrl.createEvent);
adminRouter.put("/events/:id", requireAdminPermission("events", "edit"), upload.single("image"), eventCtrl.updateEvent);
adminRouter.delete("/events/:id", requireAdminPermission("events", "delete"), eventCtrl.deleteEvent);
adminRouter.post("/events/:eventId/invite/:registrationId", requireAdminPermission("events", "sendInvitation"), upload.single("attachment"), eventCtrl.sendEventInvite);

// Article Management
adminRouter.get("/articles", requireAdminPermission("articles", "view"), articleCtrl.getAllArticles);
adminRouter.post("/articles", requireAdminPermission("articles", "create"), upload.single("image"), articleCtrl.createArticle);
adminRouter.put("/articles/:id", requireAdminPermission("articles", "edit"), upload.single("image"), articleCtrl.updateArticle);
adminRouter.delete("/articles/:id", requireAdminPermission("articles", "delete"), articleCtrl.deleteArticle);

// Leads & Search
adminRouter.get("/leads/search", adminCtrl.searchLeads);
adminRouter.delete("/leads/:id", requireAdminPermission("leads", "delete"), adminCtrl.deleteLead);
adminRouter.delete("/registrations/:id", requireAdminPermission("registrations", "delete"), adminCtrl.deleteRegistration);

// Document Repository
adminRouter.get("/repository", requireAdminPermission("repository", "view"), repoCtrl.getRepository);
adminRouter.post("/repository/upload", requireAdminPermission("repository", "upload"), upload.single("document"), repoCtrl.uploadToRepository);
adminRouter.put("/repository/:id", requireAdminPermission("repository", "edit"), upload.single("document"), repoCtrl.updateRepositoryDocument);
adminRouter.delete("/repository/:id", requireAdminPermission("repository", "delete"), repoCtrl.deleteFromRepository);

// User Document Verification & Download
adminRouter.put("/documents/:id/verify", requireAdminPermission("registrations", "verifyDocuments"), documentCtrl.verifyDocument);
adminRouter.get("/documents/download-all", documentCtrl.downloadAllDocuments);

// Admin Permissions (SUPER_ADMIN only)
adminRouter.get("/permissions", requireRoles(["SUPER_ADMIN"]), permissionsCtrl.getAdminPermissions);
adminRouter.put("/permissions/:adminId", requireRoles(["SUPER_ADMIN"]), permissionsCtrl.updateAdminPermissions);
