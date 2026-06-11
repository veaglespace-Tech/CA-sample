import { prisma } from "../../config/db.js";

// ── Admin: CRUD ──────────────────────────────────────────────

export async function getAllReviews(req, res) {
  try {
    const { serviceSlug, status, search } = req.query;
    const where = {};
    if (serviceSlug) where.serviceSlug = serviceSlug;
    if (status) where.status = status;
    if (search) {
      where.OR = [
        { name: { contains: search } },
        { company: { contains: search } },
        { text: { contains: search } },
        { service: { contains: search } },
      ];
    }
    const reviews = await prisma.review.findMany({
      where,
      orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
    });
    res.status(200).json({ ok: true, data: reviews });
  } catch (error) {
    res.status(500).json({ ok: false, message: error.message });
  }
}

export async function createReview(req, res) {
  try {
    const { name, company, location, service, serviceSlug, isGeneral, rating, text, status, sortOrder } = req.body;
    if (!name || !text) {
      return res.status(400).json({ ok: false, message: "Name and review text are required." });
    }
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;
    const review = await prisma.review.create({
      data: {
        name,
        company: company || null,
        location: location || null,
        service: service || null,
        serviceSlug: serviceSlug || null,
        isGeneral: isGeneral === "false" || isGeneral === false ? false : true,
        rating: parseInt(rating) || 5,
        text,
        imageUrl,
        status: status || "PUBLISHED",
        sortOrder: parseInt(sortOrder) || 0,
      },
    });
    res.status(201).json({ ok: true, data: review });
  } catch (error) {
    console.error("[CRITICAL] Create Review Error:", error);
    res.status(500).json({ ok: false, message: error.message });
  }
}

export async function updateReview(req, res) {
  try {
    const { id } = req.params;
    const { name, company, location, service, serviceSlug, isGeneral, rating, text, status, sortOrder } = req.body;
    const updateData = {
      name,
      company: company || null,
      location: location || null,
      service: service || null,
      serviceSlug: serviceSlug || null,
      isGeneral: isGeneral === "false" || isGeneral === false ? false : true,
      rating: parseInt(rating) || 5,
      text,
      status,
      sortOrder: parseInt(sortOrder) || 0,
    };
    if (req.file) updateData.imageUrl = `/uploads/${req.file.filename}`;

    const review = await prisma.review.update({ where: { id }, data: updateData });
    res.status(200).json({ ok: true, data: review });
  } catch (error) {
    res.status(500).json({ ok: false, message: error.message });
  }
}

export async function deleteReview(req, res) {
  try {
    const { id } = req.params;
    await prisma.review.delete({ where: { id } });
    res.status(200).json({ ok: true, message: "Review deleted" });
  } catch (error) {
    res.status(500).json({ ok: false, message: error.message });
  }
}

// ── Public: Read ─────────────────────────────────────────────

export async function getPublicReviews(req, res) {
  try {
    const { serviceSlug, general } = req.query;
    const where = { status: "PUBLISHED" };
    if (serviceSlug) {
      // Return reviews for this specific service
      where.serviceSlug = serviceSlug;
    } else if (general === "true") {
      // Return general reviews only
      where.isGeneral = true;
    }
    const reviews = await prisma.review.findMany({
      where,
      orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
      take: 50,
    });
    res.status(200).json({ ok: true, data: reviews });
  } catch (error) {
    res.status(500).json({ ok: false, message: error.message });
  }
}
