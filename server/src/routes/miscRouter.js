import { Router } from "express";
import { requireAuth, requireRoles } from "../middleware/authMiddleware.js";
import { requirePermission } from "../utils/adminPermissions.js";
import { getDashboardSummary, createSearch } from "../controllers/public/miscController.js";
import { getPublicArticles, getArticleBySlug } from "../controllers/admin/articleController.js";

export const miscRouter = Router();

miscRouter.get("/articles", getPublicArticles);
miscRouter.get("/articles/:slug", getArticleBySlug);

miscRouter.get("/modules/summary", requireAuth, requireRoles("ADMIN"), requirePermission("dashboard.view"), getDashboardSummary);

miscRouter.get("/dashboard", requireAuth, (req, res) => {
  res.status(200).json({
    ok: true,
    data: {
      user: req.user,
      role: req.user.role,
      message: `${req.user.role.replace("_", " ")} dashboard ready`,
    },
  });
});

miscRouter.post("/search", createSearch);
