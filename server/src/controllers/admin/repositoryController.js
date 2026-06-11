import { prisma } from "../../config/db.js";

export async function uploadToRepository(req, res) {
  try {
    console.log("[DEBUG] uploadToRepository triggered");
    
    if (!req.file) {
      console.error("[DEBUG] No file detected by Multer");
      return res.status(400).json({ ok: false, message: "No file was uploaded. Please select a valid file." });
    }

    const { fileName, description, category } = req.body;
    console.log("[DEBUG] Form data:", { fileName, description, category });

    const fileUrl = `/uploads/${req.file.filename}`;
    
    // Check if prisma is initialized
    if (!prisma.adminRepositoryDocument) {
      throw new Error("Prisma model 'adminRepositoryDocument' not found. Ensure migration was successful.");
    }

    const doc = await prisma.adminRepositoryDocument.create({
      data: {
        fileName: fileName || req.file.originalname,
        fileUrl,
        description: description || null,
        category: category || "GENERAL"
      }
    });

    console.log("[DEBUG] Document saved to DB:", doc.id);
    res.status(201).json({ ok: true, data: doc });
  } catch (error) {
    console.error("[CRITICAL] Repository Upload Error:", error);
    res.status(500).json({ 
      ok: false, 
      message: "Server failed to save document.",
      error: process.env.NODE_ENV === "development" ? error.message : undefined
    });
  }
}

export async function getRepository(req, res) {
  try {
    const docs = await prisma.adminRepositoryDocument.findMany({
      orderBy: { createdAt: "desc" }
    });
    res.status(200).json({ ok: true, data: docs });
  } catch (error) {
    res.status(500).json({ ok: false, message: "Failed to fetch repository" });
  }
}

export async function deleteFromRepository(req, res) {
  try {
    const { id } = req.params;
    await prisma.adminRepositoryDocument.delete({ where: { id } });
    res.status(200).json({ ok: true, message: "Document removed from repository" });
  } catch (error) {
    res.status(500).json({ ok: false, message: "Failed to delete document" });
  }
}

export async function updateRepositoryDocument(req, res) {
  try {
    const { id } = req.params;
    const { fileName, description, category } = req.body;
    
    const data = {
      fileName: fileName || undefined,
      description: description || undefined,
      category: category || undefined,
    };

    if (req.file) {
      data.fileUrl = `/uploads/${req.file.filename}`;
    }

    const updatedDoc = await prisma.adminRepositoryDocument.update({
      where: { id },
      data
    });

    res.status(200).json({ ok: true, data: updatedDoc });
  } catch (error) {
    console.error("Repository Update Error:", error);
    res.status(500).json({ ok: false, message: "Failed to update repository document" });
  }
}
