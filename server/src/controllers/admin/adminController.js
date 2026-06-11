import * as adminModule from "../../services/admin.js";
import { hasAdminPermission } from "../../features/admin-permissions/service.js";

/**
 * High-level admin data aggregation.
 */
export async function getAllPlatformData(req, res) {
  try {
    const data = await adminModule.fetchAllPlatformData(req.user);
    const filteredData = {
      ...data,
      users:
        hasAdminPermission(req.user, "users", "view") ||
        hasAdminPermission(req.user, "plans", "assign")
          ? data.users
          : [],
      leads: hasAdminPermission(req.user, "leads", "view") ? data.leads : [],
      registrations: hasAdminPermission(req.user, "registrations", "view") ? data.registrations : [],
      referrals: hasAdminPermission(req.user, "referrals", "view") ? data.referrals : [],
      referrers: hasAdminPermission(req.user, "referrals", "view") ? data.referrers : [],
      referralRewardSettings: hasAdminPermission(req.user, "referrals", "view") ? data.referralRewardSettings : [],
      events: hasAdminPermission(req.user, "events", "view") ? data.events : [],
      paymentRecords: hasAdminPermission(req.user, "payments", "view") ? data.paymentRecords : [],
    };

    const canUseServices =
      hasAdminPermission(req.user, "leads", "view") ||
      hasAdminPermission(req.user, "registrations", "view") ||
      hasAdminPermission(req.user, "plans", "view");

    filteredData.services = canUseServices ? data.services : [];
    filteredData.serviceCategories = canUseServices ? data.serviceCategories : [];

    res.status(200).json({ ok: true, data: filteredData });
  } catch (error) {
    console.error("Error fetching all platform data:", error);
    res.status(500).json({ ok: false, message: "Failed to fetch platform data." });
  }
}

/**
 * Unified search for leads and registrations.
 */
export async function searchLeads(req, res) {
  try {
    const { q } = req.query;
    if (!q) {
      return res.status(200).json({ ok: true, data: { leads: [], registrations: [] } });
    }
    const data = await adminModule.findLeads(q, req.user);
    if (!hasAdminPermission(req.user, "leads", "view")) {
      data.leads = [];
    }
    if (!hasAdminPermission(req.user, "registrations", "view")) {
      data.registrations = [];
    }
    res.status(200).json({ ok: true, data });
  } catch (error) {
    console.error("Search Leads Error:", error);
    res.status(500).json({ ok: false, message: "Failed to search leads." });
  }
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

    console.log(`[ADMIN ACTION] Verifying Doc: ${id} | Status: ${status} | Reason: ${reason}`);

    const updated = await adminModule.verifyUserDocument(id, status, reason, adminId);
    res.status(200).json({ ok: true, data: updated });
  } catch (error) {
    console.error("[CRITICAL] Verify Document Controller Error:", error);
    const statusCode = error.message === "Document record not found" ? 404 : 500;
    res.status(statusCode).json({ ok: false, message: error.message || "Internal Server Error during verification." });
  }
}

export async function deleteRegistration(req, res) {
  try {
    const { id } = req.params;
    const { prisma } = await import("../../config/db.js");
    
    const reg = await prisma.registrationLead.findUnique({ where: { id } });
    if (!reg) return res.status(404).json({ ok: false, message: "Registration not found" });

    // Fetch documents to delete physical files
    const docs = await prisma.userDocument.findMany({ where: { registrationId: id } });
    const fs = await import("fs/promises");
    const path = await import("path");
    
    for (const doc of docs) {
      if (doc.fileUrl) {
        try {
          const filePath = path.join(process.cwd(), doc.fileUrl);
          await fs.unlink(filePath);
        } catch (err) {
          console.error("Failed to unlink file:", doc.fileUrl);
        }
      }
    }

    await prisma.$transaction([
      prisma.message.deleteMany({ where: { registrationId: id } }),
      prisma.userDocument.deleteMany({ where: { registrationId: id } }),
      prisma.paymentRecord.deleteMany({ where: { registrationId: id } }),
      prisma.registrationLead.delete({ where: { id } })
    ]);

    res.status(200).json({ ok: true, message: "Registration deleted successfully" });
  } catch (error) {
    console.error("Delete Registration Error:", error);
    res.status(500).json({ ok: false, message: "Failed to delete registration" });
  }
}

export async function deleteLead(req, res) {
  try {
    const { id } = req.params;
    const { prisma } = await import("../../config/db.js");
    
    const lead = await prisma.lead.findUnique({ where: { id } });
    if (!lead) return res.status(404).json({ ok: false, message: "Lead not found" });

    // Fetch documents to delete physical files
    const docs = await prisma.userDocument.findMany({ where: { leadId: id } });
    const fs = await import("fs/promises");
    const path = await import("path");
    
    for (const doc of docs) {
      if (doc.fileUrl) {
        try {
          const filePath = path.join(process.cwd(), doc.fileUrl);
          await fs.unlink(filePath);
        } catch (err) {
          console.error("Failed to unlink file:", doc.fileUrl);
        }
      }
    }

    await prisma.$transaction([
      prisma.leadNote.deleteMany({ where: { leadId: id } }),
      prisma.message.deleteMany({ where: { leadId: id } }),
      prisma.userDocument.deleteMany({ where: { leadId: id } }),
      prisma.paymentRecord.deleteMany({ where: { leadId: id } }),
      prisma.lead.delete({ where: { id } })
    ]);

    res.status(200).json({ ok: true, message: "Lead deleted successfully" });
  } catch (error) {
    console.error("Delete Lead Error:", error);
    res.status(500).json({ ok: false, message: "Failed to delete lead" });
  }
}
