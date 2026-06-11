import * as adminModule from "../../services/admin.js";
import path from "path";

export async function createEvent(req, res) {
  try {
    console.log("[DEBUG] createEvent req.body:", req.body);
    console.log("[DEBUG] createEvent req.file:", req.file);
    const payload = { ...req.body };
    if (req.file) {
      payload.imageUrl = `/uploads/${req.file.filename}`;
    }
    const event = await adminModule.insertEvent(payload);
    res.status(201).json({ ok: true, data: event });
  } catch (error) {
    console.error("Create Event Error:", error);
    res.status(500).json({ ok: false, message: error.message || "Failed to create event." });
  }
}

export async function updateEvent(req, res) {
  try {
    const { id } = req.params;
    console.log("[DEBUG] updateEvent req.body:", req.body);
    console.log("[DEBUG] updateEvent req.file:", req.file);
    const payload = { ...req.body };
    if (req.file) {
      payload.imageUrl = `/uploads/${req.file.filename}`;
    }
    const event = await adminModule.modifyEvent(id, payload);
    res.status(200).json({ ok: true, data: event });
  } catch (error) {
    console.error("Update Event Error:", error);
    res.status(500).json({ ok: false, message: error.message || "Failed to update event." });
  }
}

export async function deleteEvent(req, res) {
  try {
    const { id } = req.params;
    await adminModule.removeEvent(id);
    res.status(200).json({ ok: true, message: "Event deleted successfully." });
  } catch (error) {
    console.error("Delete Event Error:", error);
    res.status(500).json({ ok: false, message: "Failed to delete event." });
  }
}

import { prisma } from "../../config/db.js";
import { sendEmail } from "../../utils/mailer.js";

export async function sendEventInvite(req, res) {
  try {
    const { eventId, registrationId } = req.params;
    const { content, repositoryDocId } = req.body;
    
    console.log("[sendEventInvite] req.body:", req.body, "req.file:", req.file);

    const registration = await prisma.eventRegistration.findUnique({
      where: { id: registrationId }
    });

    if (!registration) {
      return res.status(404).json({ ok: false, message: "Registration not found." });
    }

    const event = await prisma.event.findUnique({
      where: { id: eventId }
    });

    if (!event) {
      return res.status(404).json({ ok: false, message: "Event not found." });
    }

    const attachments = [];
    if (req.file) {
      attachments.push({
        filename: req.file.originalname,
        path: req.file.path
      });
    }

    if (repositoryDocId) {
      const repoDoc = await prisma.adminRepositoryDocument.findUnique({ where: { id: repositoryDocId } });
      if (repoDoc) {
        const ext = path.extname(repoDoc.fileUrl);
        const hasExt = repoDoc.fileName.toLowerCase().endsWith(ext.toLowerCase());
        const finalName = hasExt ? repoDoc.fileName : `${repoDoc.fileName}${ext}`;

        attachments.push({
          filename: finalName,
          path: path.join(process.cwd(), repoDoc.fileUrl)
        });
      }
    }

    const eventDate = new Date(event.date).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
    const eventTime = event.time || "TBA";
    
    let htmlContent = `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
        <h2 style="color: #4f46e5;">You're Invited!</h2>
        <p>Hi <strong>${registration.name}</strong>,</p>
        <p>Thank you for registering for our event: <strong>${event.title}</strong>.</p>
        
        <div style="background: #f8fafc; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <p style="margin: 5px 0;"><strong>Date:</strong> ${eventDate}</p>
          <p style="margin: 5px 0;"><strong>Time:</strong> ${eventTime}</p>
          ${event.location ? `<p style="margin: 5px 0;"><strong>Location:</strong> ${event.location}</p>` : ''}
        </div>
    `;

    if (content) {
      htmlContent += `
        <div style="margin: 20px 0; padding: 15px; border-left: 4px solid #4f46e5; background-color: #f1f5f9; white-space: pre-wrap;">
          ${content}
        </div>
      `;
    }

    if (event.videoUrl) {
      htmlContent += `
        <div style="margin-top: 20px;">
          <a href="${event.videoUrl}" style="background-color: #ef4444; color: white; padding: 10px 20px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">▶ Join/Watch Event</a>
        </div>
      `;
    }

    htmlContent += `
        <p style="margin-top: 30px;">We look forward to seeing you there!</p>
        <p style="color: #64748b; font-size: 12px; margin-top: 20px;">- Veagle Space Technology Team</p>
      </div>
    `;

    // Fire and forget so the API responds instantly
    sendEmail({
      to: registration.email,
      subject: `Invitation: ${event.title}`,
      html: htmlContent,
      attachments
    }).catch(err => console.error("Async sendEmail Error:", err));

    res.status(200).json({ ok: true, message: "Invitation sent successfully." });
  } catch (error) {
    console.error("Send Event Invite Error:", error);
    res.status(500).json({ ok: false, message: "Failed to process invitation." });
  }
}
