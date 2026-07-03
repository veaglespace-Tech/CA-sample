import { prisma } from "../../config/db.js";
import { slugify } from "../../utils/core.js";

export async function createArticle(req, res) {
  try {
    const { title, excerpt, content, category, videoUrl, status } = req.body;
    if (!title || !content) {
      return res.status(400).json({ ok: false, message: "Title and content are required" });
    }

    const slug = slugify(title) + "-" + Math.random().toString(36).substring(7);
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;

    const article = await prisma.article.create({
      data: {
        title,
        slug,
        excerpt: excerpt || null,
        content,
        category: category || "GENERAL",
        imageUrl,
        videoUrl: videoUrl || null,
        status: status || "DRAFT",
        publishedAt: status === "PUBLISHED" ? new Date() : null
      }
    });

    res.status(201).json({ ok: true, data: article });
  } catch (error) {
    console.error("[CRITICAL] Create Article Error:", error);
    res.status(500).json({ ok: false, message: error.message });
  }
}

export async function updateArticle(req, res) {
  try {
    const { id } = req.params;
    const { title, excerpt, content, category, videoUrl, status } = req.body;
    
    const updateData = {
      title,
      excerpt: excerpt || null,
      content,
      category,
      videoUrl: videoUrl || null,
      status
    };

    if (req.file) {
      updateData.imageUrl = `/uploads/${req.file.filename}`;
    }

    if (status === "PUBLISHED") {
      updateData.publishedAt = new Date();
    }

    const article = await prisma.article.update({
      where: { id },
      data: updateData
    });

    res.status(200).json({ ok: true, data: article });
  } catch (error) {
    res.status(500).json({ ok: false, message: error.message });
  }
}

export async function deleteArticle(req, res) {
  try {
    const { id } = req.params;
    await prisma.article.delete({ where: { id } });
    res.status(200).json({ ok: true, message: "Article deleted" });
  } catch (error) {
    res.status(500).json({ ok: false, message: error.message });
  }
}

export async function getAllArticles(req, res) {
  try {
    const articles = await prisma.article.findMany({
      orderBy: { createdAt: "desc" }
    });
    res.status(200).json({ ok: true, data: articles });
  } catch (error) {
    res.status(500).json({ ok: false, message: error.message });
  }
}

export async function getPublicArticles(req, res) {
  try {
    const articles = await prisma.article.findMany({
      where: { status: "PUBLISHED" },
      orderBy: { publishedAt: "desc" }
    });
    res.status(200).json({ ok: true, data: articles });
  } catch (error) {
    res.status(500).json({ ok: false, message: error.message });
  }
}

export async function getArticleBySlug(req, res) {
  try {
    const { slug } = req.params;
    const article = await prisma.article.findFirst({
      where: { slug, status: "PUBLISHED" }
    });
    if (!article) return res.status(404).json({ ok: false, message: "Article not found" });
    res.status(200).json({ ok: true, data: article });
  } catch (error) {
    res.status(500).json({ ok: false, message: error.message });
  }
}
