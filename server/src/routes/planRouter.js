import { Router } from "express";
import { getPlansByService, createPlan, updatePlan, deletePlan, getAllPlans, assignPlanToUser } from "../controllers/admin/planController.js";
import { requireAuth, requireRoles, requireAdminPermission } from "../middleware/authMiddleware.js";

export const planRouter = Router();

// Public route to fetch plans for a service
planRouter.get("/plans/service/:slug", getPlansByService);

// Admin routes
planRouter.get("/plans/all", requireAuth, requireRoles(["ADMIN", "SUPER_ADMIN"]), requireAdminPermission("plans", "view"), getAllPlans);
planRouter.post("/plans", requireAuth, requireRoles(["ADMIN", "SUPER_ADMIN"]), requireAdminPermission("plans", "create"), createPlan);
planRouter.post("/plans/:id/assign-user", requireAuth, requireRoles(["ADMIN", "SUPER_ADMIN"]), requireAdminPermission("plans", "assign"), assignPlanToUser);
planRouter.put("/plans/:id", requireAuth, requireRoles(["ADMIN", "SUPER_ADMIN"]), requireAdminPermission("plans", "edit"), updatePlan);
planRouter.delete("/plans/:id", requireAuth, requireRoles(["ADMIN", "SUPER_ADMIN"]), requireAdminPermission("plans", "delete"), deletePlan);
