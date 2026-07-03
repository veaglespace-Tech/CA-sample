import { Router } from "express";
import { getPublicArticles, getArticleBySlug } from "../controllers/admin/articleController.js";

const router = Router();

router.get("/", getPublicArticles);
router.get("/:slug", getArticleBySlug);

export default router;
