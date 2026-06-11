import { prisma } from "../../config/db.js";
import { hasAdminPermission } from "../../features/admin-permissions/service.js";

function isStaffUser(user) {
  return user?.role === "ADMIN" || user?.role === "SUPER_ADMIN";
}

function deny(res, message, permission) {
  return res.status(403).json({
    ok: false,
    message,
    code: "ADMIN_PERMISSION_DENIED",
    permission,
  });
}

export async function sendMessage(req, res) {
  try {
    console.log("---- MESSAGE CONTROLLER /send HIT ----");
    console.log("req.body:", req.body);
    console.log("req.file:", req.file);
    const { receiverId, registrationId, leadId, contactQueryId, content, isDocRequest, requestedDocName } = req.body;
    const senderId = req.user.id;
    const file = req.file;

    if (!receiverId || (!content && !file && !isDocRequest)) {
      console.log("Validation failed:", { receiverId, content, file: !!file, isDocRequest });
      return res.status(400).json({ ok: false, message: "Receiver ID and content/file/document request are required." });
    }

    if (isStaffUser(req.user) && req.user.role !== "SUPER_ADMIN") {
      const wantsDocRequest = isDocRequest === "true" || isDocRequest === true;

      if (registrationId && !hasAdminPermission(req.user, "registrations", wantsDocRequest ? "requestDocuments" : "sendMessage")) {
        return deny(
          res,
          wantsDocRequest ? "You do not have permission to request registration documents." : "You do not have permission to message registration clients.",
          { module: "registrations", action: wantsDocRequest ? "requestDocuments" : "sendMessage" },
        );
      }
      if (leadId && !hasAdminPermission(req.user, "leads", wantsDocRequest ? "requestDocuments" : "sendMessage")) {
        return deny(
          res,
          wantsDocRequest ? "You do not have permission to request lead documents." : "You do not have permission to message lead clients.",
          { module: "leads", action: wantsDocRequest ? "requestDocuments" : "sendMessage" },
        );
      }
      if (contactQueryId && !hasAdminPermission(req.user, "contacts", "sendMessage")) {
        return deny(res, "You do not have permission to reply to contact queries.", { module: "contacts", action: "sendMessage" });
      }
      if (!registrationId && !leadId && !contactQueryId) {
        const canDirectMessage =
          hasAdminPermission(req.user, "users", "sendMessage") ||
          hasAdminPermission(req.user, "payments", "sendMessage") ||
          hasAdminPermission(req.user, "leads", "sendMessage") ||
          hasAdminPermission(req.user, "registrations", "sendMessage");

        if (!canDirectMessage) {
          return deny(res, "You do not have permission to send direct client messages.", { module: "users", action: "sendMessage" });
        }
      }
    }

    // 1. Create the message
    const message = await prisma.message.create({
      data: {
        senderId,
        receiverId,
        registrationId: (registrationId && registrationId !== "null") ? registrationId : null,
        leadId: (leadId && leadId !== "null") ? leadId : null,
        content: content || (file ? `Sent an attachment: ${file.originalname}` : (isDocRequest === "true" || isDocRequest === true ? `Requested document: ${requestedDocName}` : "")),
        isDocRequest: isDocRequest === "true" || isDocRequest === true,
        requestedDocName: requestedDocName || null,
      },
      include: {
        sender: { select: { name: true } }
      }
    });

    if (!isStaffUser(req.user)) {
      try {
        const userDetails = await prisma.user.findUnique({ where: { id: senderId } });
        const userEmail = userDetails?.email || "N/A";
        const userPhone = userDetails?.phone || "N/A";

        const { alertClientMessage } = await import("../../services/adminAlerts.js");
        await alertClientMessage(req.user.name, userEmail, userPhone, message.content);
      } catch (err) {
        console.error("Non-fatal: failed to send admin notification", err);
      }
    }

    // 2. If there's an attachment OR a repository document
    const { repositoryDocId } = req.body;
    if (file || repositoryDocId) {
      let docData = null;
      if (file) {
        docData = {
          fileName: file.originalname,
          fileUrl: `/uploads/${file.filename}`,
        };
      } else if (repositoryDocId && repositoryDocId !== "undefined") {
        const repoDoc = await prisma.adminRepositoryDocument.findUnique({ where: { id: repositoryDocId } });
        if (repoDoc) {
          docData = {
            fileName: repoDoc.fileName,
            fileUrl: repoDoc.fileUrl,
          };
        }
      }

      if (docData) {
        const isAdmin = req.user.role === "ADMIN" || req.user.role === "SUPER_ADMIN";
        await prisma.userDocument.create({
          data: {
            userId: receiverId, // Link to recipient so they can see it in their docs too
            messageId: message.id,
            registrationId: (registrationId && registrationId !== "null") ? registrationId : null,
            leadId: (leadId && leadId !== "null") ? leadId : null,
            documentType: "ADMIN_UPLOAD",
            fileName: docData.fileName,
            fileUrl: docData.fileUrl,
            status: "VERIFIED", // Admin uploads are pre-verified
            isSentByAdmin: isAdmin,
          }
        });
      }
    }

    if (contactQueryId && contactQueryId !== "null" && contactQueryId !== "undefined") {
      await prisma.contactQuery.update({
        where: { id: contactQueryId },
        data: { status: "CONVERTED" }
      }).catch(err => console.error("Error updating ContactQuery status on message send:", err));
    }

    res.status(201).json({ ok: true, data: message });
  } catch (error) {
    console.error("Send Message Error:", error);
    res.status(500).json({ ok: false, message: "Failed to send message." });
  }
}

export async function getMyMessages(req, res) {
  try {
    const userId = req.user.id;
    // We want messages where user is receiver OR sender (if we want sent messages too)
    // But currently UI might only expect received. Let's stick to receiver for now
    // or both for a proper chat history. The original code was receiverId: userId.
    const messages = await prisma.message.findMany({
      where: { 
        OR: [
          { receiverId: userId },
          { senderId: userId }
        ]
      },
      include: {
        sender: { select: { name: true, role: true } },
        receiver: { select: { name: true, role: true } },
        registrationLead: { select: { registrationType: true } },
        lead: { select: { serviceName: true } },
        documents: true
      },
      orderBy: { createdAt: "desc" },
    });
    res.status(200).json({ ok: true, data: messages });
  } catch (error) {
    console.error("Get Messages Error:", error);
    res.status(500).json({ ok: false, message: "Failed to fetch messages." });
  }
}

export async function getUnreadCount(req, res) {
  try {
    const userId = req.user.id;
    const count = await prisma.message.count({
      where: { receiverId: userId, isRead: false },
    });
    res.status(200).json({ ok: true, count });
  } catch (error) {
    console.error("Get Unread Count Error:", error);
    res.status(500).json({ ok: false, message: "Failed to fetch unread count." });
  }
}

export async function markAsRead(req, res) {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    if (id === "all") {
      await prisma.message.updateMany({
        where: { receiverId: userId, isRead: false },
        data: { isRead: true },
      });
    } else {
      await prisma.message.updateMany({
        where: { id, receiverId: userId },
        data: { isRead: true },
      });
    }

    res.status(200).json({ ok: true, message: "Message marked as read." });
  } catch (error) {
    console.error("Mark Read Error:", error);
    res.status(500).json({ ok: false, message: "Failed to update message." });
  }
}

export async function deleteMessage(req, res) {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const msg = await prisma.message.findUnique({ where: { id } });
    if (!msg) {
      return res.status(404).json({ ok: false, message: "Message not found." });
    }

    if (msg.senderId !== userId && req.user.role !== "ADMIN" && req.user.role !== "SUPER_ADMIN") {
      return res.status(403).json({ ok: false, message: "Unauthorized." });
    }

    if (req.user.role === "ADMIN") {
      if (msg.registrationId && !hasAdminPermission(req.user, "registrations", "sendMessage")) {
        return deny(res, "You do not have permission to manage registration messages.", { module: "registrations", action: "sendMessage" });
      }
      if (msg.leadId && !hasAdminPermission(req.user, "leads", "sendMessage")) {
        return deny(res, "You do not have permission to manage lead messages.", { module: "leads", action: "sendMessage" });
      }
    }

    await prisma.message.delete({ where: { id } });
    res.status(200).json({ ok: true, message: "Message deleted successfully." });
  } catch (error) {
    console.error("Delete Message Error:", error);
    res.status(500).json({ ok: false, message: "Failed to delete message." });
  }
}

export async function sendEmailReminder(req, res) {
  try {
    const { userId, documentName, serviceName } = req.body;
    
    if (!userId || !documentName) {
      return res.status(400).json({ ok: false, message: "User ID and Document Name are required." });
    }

    if (isStaffUser(req.user) && req.user.role !== "SUPER_ADMIN") {
      const canRemind =
        hasAdminPermission(req.user, "leads", "sendMessage") ||
        hasAdminPermission(req.user, "registrations", "sendMessage") ||
        hasAdminPermission(req.user, "registrations", "requestDocuments");

      if (!canRemind) {
        return deny(res, "You do not have permission to send document reminders.", { module: "registrations", action: "requestDocuments" });
      }
    }

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      return res.status(404).json({ ok: false, message: "User not found." });
    }

    const { sendEmail } = await import("../../utils/mailer.js");
    
    const serviceText = serviceName ? ` for your <strong>${serviceName}</strong> service` : "";
    
    await sendEmail({
      to: user.email,
      subject: `Action Required: Pending Document Upload for Your Company Name`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; line-height: 1.6;">
          <h2 style="color: #3b82f6;">Document Upload Reminder</h2>
          <p>Hi ${user.name || "Client"},</p>
          <p>This is a gentle reminder that we are waiting on a pending document${serviceText}.</p>
          <p><strong>Required Document:</strong> <span style="background: #f4f4f5; padding: 4px 8px; border-radius: 4px; font-family: monospace;">${documentName}</span></p>
          <p>Please log in to your Your Company Name dashboard and upload this document as soon as possible so we can proceed with your service.</p>
          <br/>
          <p>Thank you,<br/><strong>Your Company Name Team</strong></p>
        </div>
      `,
    });

    res.status(200).json({ ok: true, message: "Email reminder sent successfully." });
  } catch (error) {
    console.error("Send Email Reminder Error:", error);
    res.status(500).json({ ok: false, message: "Failed to send email reminder." });
  }
}
