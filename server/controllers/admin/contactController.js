import * as contactModule from "../../services/contactService.js";
import { sendEmail } from "../../utils/mailer.js";
import { prisma } from "../../config/db.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { hasAdminPermission } from "../../features/admin-permissions/service.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function getUnreadContacts(req, res) {
  try {
    const contacts = await contactModule.fetchUnreadContacts();
    res.status(200).json({ ok: true, data: contacts });
  } catch (error) {
    console.error("Error fetching unread contacts:", error);
    res.status(500).json({ ok: false, error: "Failed to fetch notifications" });
  }
}

export async function markAsRead(req, res) {
  try {
    const { id } = req.params;
    await contactModule.updateContactReadStatus(id);
    res.status(200).json({ ok: true, message: "Marked as read" });
  } catch (error) {
    console.error("Error marking contact as read:", error);
    res.status(500).json({ ok: false, error: "Failed to update status" });
  }
}

export async function deleteContact(req, res) {
  try {
    const { id } = req.params;
    await contactModule.removeContact(id);
    res.status(200).json({ ok: true, message: "Deleted successfully" });
  } catch (error) {
    console.error("Error deleting contact:", error);
    res.status(500).json({ ok: false, error: "Failed to delete contact query" });
  }
}

export async function getAllContacts(req, res) {
  try {
    const contacts = await contactModule.fetchAllContacts();
    res.status(200).json({ ok: true, data: contacts });
  } catch (error) {
    console.error("Error fetching contacts:", error);
    res.status(500).json({ ok: false, error: "Failed to fetch contacts" });
  }
}

export async function replyToContact(req, res) {
  try {
    const { email, subject, message, repositoryDocId } = req.body;
    const isCustomPayment = req.body.isCustomPayment === true || req.body.isCustomPayment === "true";
    
    if (!email || !message) {
      return res.status(400).json({ ok: false, error: "Email and message are required" });
    }

    const allowed = isCustomPayment
      ? hasAdminPermission(req.user, "payments", "sendMessage")
      : hasAdminPermission(req.user, "contacts", "sendMessage");

    if (!allowed) {
      return res.status(403).json({
        ok: false,
        error: isCustomPayment
          ? "You do not have permission to email paid clients."
          : "You do not have permission to reply to contact queries.",
      });
    }

    let attachments = [];
    if (repositoryDocId) {
      const repoDoc = await prisma.adminRepositoryDocument.findUnique({ where: { id: repositoryDocId } });
      if (repoDoc) {
        // Resolve absolute path from this controller's directory back to the project root
        const rootDir = path.resolve(__dirname, "../../");
        const filePath = path.join(rootDir, repoDoc.fileUrl);
        
        if (fs.existsSync(filePath)) {
          attachments.push({
            filename: repoDoc.fileName.endsWith(path.extname(repoDoc.fileUrl)) 
                        ? repoDoc.fileName 
                        : repoDoc.fileName + path.extname(repoDoc.fileUrl),
            path: filePath
          });
        } else {
          return res.status(404).json({ ok: false, error: "The selected document could not be found on the server disk. It may have been deleted." });
        }
      } else {
        return res.status(404).json({ ok: false, error: "The selected document record no longer exists." });
      }
    }

    await sendEmail({
      to: email,
      subject: subject || "Reply to your inquiry at Veagle Space Technology Pvt. Ltd.",
      html: `<p>${message.replace(/\n/g, '<br/>')}</p>`,
      attachments: attachments.length > 0 ? attachments : undefined
    });

    const { id } = req.params;
    if (id && id !== "undefined" && !isCustomPayment) {
      await contactModule.updateContactStatus(id, "CONVERTED");
    }

    res.status(200).json({ ok: true, message: "Reply sent successfully" });
  } catch (error) {
    console.error("Error replying to contact:", error);
    res.status(500).json({ ok: false, error: "Failed to send email reply" });
  }
}

export async function updateContactStatus(req, res) {
  try {
    const { id } = req.params;
    const { status } = req.body;
    if (!status) return res.status(400).json({ ok: false, error: "Status is required" });
    
    await contactModule.updateContactStatus(id, status);
    res.status(200).json({ ok: true, message: "Status updated successfully" });
  } catch (error) {
    console.error("Error updating contact status:", error);
    res.status(500).json({ ok: false, error: "Failed to update contact status" });
  }
}
