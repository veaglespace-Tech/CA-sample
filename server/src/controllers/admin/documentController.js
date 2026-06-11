import * as adminModule from "../../services/admin.js";
import { prisma } from "../../config/db.js";
import { ZipArchive } from "archiver";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { hasAdminPermission } from "../../features/admin-permissions/service.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const commonDocTypes = ["PAN Card", "Aadhaar Card", "Photo"];
const normalizedCommonDocTypes = new Set(commonDocTypes.map((type) => type.toLowerCase()));

function uniqueDocuments(documents = []) {
  const seen = new Set();
  return documents.filter((doc) => {
    if (!doc?.id || seen.has(doc.id) || doc.status === "REJECTED") return false;
    seen.add(doc.id);
    return true;
  });
}

function resolveStoredFilePath(fileUrl) {
  if (!fileUrl || /^https?:\/\//i.test(fileUrl)) return null;
  const relativeUrl = String(fileUrl).replace(/^\/+/, "");
  return path.resolve(process.cwd(), relativeUrl);
}

/**
 * Verify a user-uploaded document.
 */
export async function verifyDocument(req, res) {
  try {
    const { id } = req.params;
    const { status, reason } = req.body; 
    const adminId = req.user.id;

    if (!id) return res.status(400).json({ ok: false, message: "Document ID is required." });

    const document = await prisma.userDocument.findUnique({
      where: { id },
      select: { id: true, leadId: true, registrationId: true },
    });

    if (!document) {
      return res.status(404).json({ ok: false, message: "Document record not found." });
    }

    if (document.registrationId && !hasAdminPermission(req.user, "registrations", "verifyDocuments")) {
      return res.status(403).json({ ok: false, message: "You do not have permission to verify registration documents." });
    }

    if (document.leadId && !hasAdminPermission(req.user, "leads", "verifyDocuments")) {
      return res.status(403).json({ ok: false, message: "You do not have permission to verify lead documents." });
    }

    console.log(`[ADMIN ACTION] Verifying Doc: ${id} | Status: ${status} | Reason: ${reason}`);

    const updated = await adminModule.verifyUserDocument(id, status, reason, adminId);
    res.status(200).json({ ok: true, data: updated });
  } catch (error) {
    console.error("[CRITICAL] Verify Document Controller Error:", error);
    const statusCode = error.message === "Document record not found" ? 404 : 500;
    res.status(statusCode).json({ ok: false, message: error.message || "Internal Server Error during verification." });
  }
}

/**
 * Download all documents for a specific service/registration in a single ZIP file.
 */
export async function downloadAllDocuments(req, res) {
  try {
    const { type, id } = req.query; // type: 'lead' or 'registration'

    if (!id || !type) {
      return res.status(400).json({ ok: false, message: "Missing type or id parameters." });
    }

    if (type === "lead" && !hasAdminPermission(req.user, "leads", "view")) {
      return res.status(403).json({ ok: false, message: "You do not have permission to view lead documents." });
    }
    if (type === "registration" && !hasAdminPermission(req.user, "registrations", "view")) {
      return res.status(403).json({ ok: false, message: "You do not have permission to view registration documents." });
    }

    let documents = [];
    let clientName = "Unknown_Client";
    let serviceName = "Service";

    if (type === "lead") {
      const lead = await prisma.lead.findUnique({
        where: { id },
        include: { documents: true, user: { include: { documents: true } }, service: true }
      });
      if (!lead) return res.status(404).json({ ok: false, message: "Lead not found." });
      documents = uniqueDocuments([
        ...(lead.documents || []),
        ...(lead.user?.documents || []).filter((doc) => normalizedCommonDocTypes.has(String(doc.documentType || "").toLowerCase())),
      ]);
      clientName = lead.user?.name || lead.fullName || "Client";
      serviceName = lead.service?.name || lead.serviceName || "Service";
    } else if (type === "registration") {
      const reg = await prisma.registrationLead.findUnique({
        where: { id },
        include: { documents: true, user: { include: { documents: true } }, service: true }
      });
      if (!reg) return res.status(404).json({ ok: false, message: "Registration not found." });
      documents = uniqueDocuments([
        ...(reg.documents || []),
        ...(reg.user?.documents || []).filter((doc) => normalizedCommonDocTypes.has(String(doc.documentType || "").toLowerCase())),
      ]);
      clientName = reg.user?.name || reg.fullName || "Client";
      serviceName = reg.service?.name || reg.registrationType || "Service";
    } else {
      return res.status(400).json({ ok: false, message: "Invalid type." });
    }

    if (!documents || documents.length === 0) {
      return res.status(404).json({ ok: false, message: "No documents found for this service." });
    }

    // Clean up strings for safe filename
    const safeClientName = clientName.replace(/[^a-zA-Z0-9]/g, '_');
    const safeServiceName = serviceName.replace(/[^a-zA-Z0-9]/g, '_');
    const zipFilename = `${safeClientName}_${safeServiceName}_Documents.zip`;

    // Pre-check if any files actually exist on disk before sending headers
    const validFiles = [];
    for (const doc of documents) {
      const filePath = resolveStoredFilePath(doc.fileUrl);
      if (filePath && fs.existsSync(filePath)) {
        validFiles.push({ doc, filePath });
      } else {
        console.warn(`File missing on disk: ${doc.fileUrl || "unknown"}`);
      }
    }

    if (validFiles.length === 0) {
      return res.status(404).json({ ok: false, message: "No actual files were found on the server. They may have been deleted." });
    }

    res.writeHead(200, {
      'Content-Type': 'application/zip',
      'Content-Disposition': `attachment; filename="${zipFilename}"`
    });

    const archive = new ZipArchive({
      zlib: { level: 9 }
    });

    archive.on('error', function(err) {
      console.error('Archive error:', err);
      if (!res.headersSent) {
        res.status(500).json({ ok: false, message: 'Failed to create ZIP: ' + err.message });
      }
    });

    archive.pipe(res);

    for (const { doc, filePath } of validFiles) {
      const safeDocType = (doc.documentType || 'Document').replace(/[^a-zA-Z0-9 \-_]/g, '');
      const entryName = `${safeDocType} - ${doc.fileName}`;
      archive.file(filePath, { name: entryName });
    }

    await archive.finalize();

  } catch (error) {
    console.error("Error downloading documents:", error);
    // Note: if headers are already sent, res.status will throw an error, but express usually handles this or we can check res.headersSent
    if (!res.headersSent) {
      res.status(500).json({ ok: false, message: "Failed to create ZIP file." });
    }
  }
}
