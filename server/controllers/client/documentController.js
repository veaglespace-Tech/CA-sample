import { prisma } from "../../config/db.js";
import fs from "fs";
import path from "path";
import { alertDocumentUpload } from "../../services/adminAlerts.js";

export async function uploadDocument(req, res) {
  try {
    const { documentType, registrationId, leadId, messageId, existingDocId } = req.body;
    const userId = req.user.id;

    // 1. Handle "Use Existing Document" (Link logic)
    if (existingDocId) {
      try {
        const existingDoc = await prisma.userDocument.findUnique({ where: { id: existingDocId } });
        if (!existingDoc) return res.status(404).json({ ok: false, message: "Original document not found." });

        const newDoc = await prisma.userDocument.create({
          data: {
            userId,
            registrationId: (registrationId && registrationId !== "null") ? registrationId : null,
            leadId: (leadId && leadId !== "null") ? leadId : null,
            messageId: (messageId && messageId !== "null") ? messageId : null,
            documentType: documentType || existingDoc.documentType,
            fileName: existingDoc.fileName,
            fileUrl: existingDoc.fileUrl,
            status: "VERIFIED",
          },
        });

        // Auto-replicate common documents (PAN Card, Aadhaar Card, Photo) across other user services
        const commonDocTypes = ["PAN Card", "Aadhaar Card", "Photo"];
        if (commonDocTypes.includes(newDoc.documentType)) {
          try {
            const [userLeads, userRegistrations] = await Promise.all([
              prisma.lead.findMany({ where: { userId } }),
              prisma.registrationLead.findMany({ where: { userId } })
            ]);

            const allTargetLeads = [...userLeads, ...userRegistrations];

            for (const target of allTargetLeads) {
              const isReg = !!target.registrationType;
              const targetRegId = isReg ? target.id : null;
              const targetLeadId = !isReg ? target.id : null;

              const currentRegId = (registrationId && registrationId !== "null") ? registrationId : null;
              const currentLeadId = (leadId && leadId !== "null") ? leadId : null;
              if (targetRegId === currentRegId && targetLeadId === currentLeadId) continue;

              const existingForTarget = await prisma.userDocument.findFirst({
                where: {
                  userId,
                  registrationId: targetRegId,
                  leadId: targetLeadId,
                  documentType: newDoc.documentType
                }
              });

              if (!existingForTarget) {
                await prisma.userDocument.create({
                  data: {
                    userId,
                    registrationId: targetRegId,
                    leadId: targetLeadId,
                    documentType: newDoc.documentType,
                    fileName: newDoc.fileName,
                    fileUrl: newDoc.fileUrl,
                    status: "VERIFIED",
                  }
                });
              }
            }
          } catch (syncErr) {
            console.error("Auto replication of linked common document failed:", syncErr);
          }
        }

        // Notify the Admin who requested it
        try {
          let targetAdminId = null;
          if (messageId && messageId !== "null") {
            const msg = await prisma.message.findUnique({ where: { id: messageId } });
            if (msg) {
              targetAdminId = msg.senderId;
              
              if (msg.isDocRequest) {
                // Performance enhancement: Instantly mark request as fulfilled
                await prisma.message.update({
                  where: { id: messageId },
                  data: { isDocRequest: false }
                });
              }
            }
          }

          if (!targetAdminId) {
            const admins = await prisma.user.findMany({ where: { role: { in: ["ADMIN", "SUPER_ADMIN"] } } });
            const primaryAdmin = admins.find(a => a.id !== userId);
            if (primaryAdmin) targetAdminId = primaryAdmin.id;
          }

          const userName = req.user.name || "A client";
          
          if (targetAdminId) {
            await prisma.message.create({
              data: {
                senderId: userId,
                receiverId: targetAdminId,
                content: `${userName} fulfilled a requirement using an existing document: ${newDoc.documentType} (${newDoc.fileName}).`,
                registrationId: newDoc.registrationId,
                leadId: newDoc.leadId,
              }
            });
          }
        } catch (notifErr) { console.error("Link notification failed:", notifErr); }

        try {
          const userDetails = await prisma.user.findUnique({ where: { id: userId } });
          const userEmail = userDetails?.email || "N/A";
          const userPhone = userDetails?.phone || "N/A";

          await alertDocumentUpload(
            newDoc.documentType,
            newDoc.fileName,
            req.user.name,
            userEmail,
            userPhone,
            true
          );
        } catch (err) {
          console.error("Non-fatal: failed to send admin notification", err);
        }

        return res.status(201).json({ ok: true, data: newDoc });
      } catch (err) {
        console.error("[uploadDocument] Linking failed:", err);
        return res.status(500).json({ ok: false, message: "Failed to link existing document." });
      }
    }

    if (!req.file) {
      return res.status(400).json({ ok: false, message: "No file uploaded." });
    }

    let finalDocumentType = documentType;
    let targetAdminId = null;

    if (messageId && messageId !== "null") {
      try {
        const msg = await prisma.message.findUnique({ where: { id: messageId } });
        if (msg) {
          targetAdminId = msg.senderId; // The admin who requested it
          if (documentType === "OTHER" && msg.isDocRequest && msg.requestedDocName) {
            finalDocumentType = msg.requestedDocName;
          }
          
          if (msg.isDocRequest) {
            // Performance enhancement: Instantly mark request as fulfilled for ANY document uploaded against it
            await prisma.message.update({
              where: { id: messageId },
              data: { isDocRequest: false }
            });
          }
        }
      } catch (err) {
        console.error("[uploadDocument] Error fetching message:", err);
      }
    }

    // 1. Find all Admins and Super Admins to notify
    if (!targetAdminId) {
      try {
        const admins = await prisma.user.findMany({
          where: { role: { in: ["ADMIN", "SUPER_ADMIN"] } }
        });
        const primaryAdmin = admins.find(a => a.id !== userId);
        if (primaryAdmin) targetAdminId = primaryAdmin.id;
      } catch (err) {
        console.error("[uploadDocument] Admin lookup failed:", err);
      }
    }

    // 2. Create the notification message for the target Admin
    let mainAdminMessageId = null;
    const userName = req.user.name || "A client";
    
    if (targetAdminId) {
      try {
        const adminMsg = await prisma.message.create({
          data: {
            senderId: userId,
            receiverId: targetAdminId,
            content: `${userName} uploaded a document: ${finalDocumentType} (${req.file.originalname}).`,
            registrationId: (registrationId && registrationId !== "null") ? registrationId : null,
            leadId: (leadId && leadId !== "null") ? leadId : null,
          }
        });
        mainAdminMessageId = adminMsg.id;
      } catch (msgErr) {
        console.error(`[uploadDocument] Failed to notify target admin:`, msgErr);
      }
    }

    // 3. Save document info to database (linked to a notification message)
    try {
      const document = await prisma.userDocument.create({
        data: {
          userId,
          registrationId: (registrationId && registrationId !== "null") ? registrationId : null,
          leadId: (leadId && leadId !== "null") ? leadId : null,
          messageId: mainAdminMessageId,
          documentType: finalDocumentType,
          fileName: req.file.originalname,
          fileUrl: `/uploads/${req.file.filename}`,
          status: "PENDING",
        },
      });

      // Auto-replicate common documents (PAN Card, Aadhaar Card, Photo) across other user services
      const commonDocTypes = ["PAN Card", "Aadhaar Card", "Photo"];
      if (commonDocTypes.includes(finalDocumentType)) {
        try {
          const [userLeads, userRegistrations] = await Promise.all([
            prisma.lead.findMany({ where: { userId } }),
            prisma.registrationLead.findMany({ where: { userId } })
          ]);

          const allTargetLeads = [...userLeads, ...userRegistrations];

          for (const target of allTargetLeads) {
            const isReg = !!target.registrationType;
            const targetRegId = isReg ? target.id : null;
            const targetLeadId = !isReg ? target.id : null;

            const currentRegId = (registrationId && registrationId !== "null") ? registrationId : null;
            const currentLeadId = (leadId && leadId !== "null") ? leadId : null;
            if (targetRegId === currentRegId && targetLeadId === currentLeadId) continue;

            const existingForTarget = await prisma.userDocument.findFirst({
              where: {
                userId,
                registrationId: targetRegId,
                leadId: targetLeadId,
                documentType: finalDocumentType
              }
            });

            if (!existingForTarget) {
              await prisma.userDocument.create({
                data: {
                  userId,
                  registrationId: targetRegId,
                  leadId: targetLeadId,
                  documentType: finalDocumentType,
                  fileName: req.file.originalname,
                  fileUrl: `/uploads/${req.file.filename}`,
                  status: "PENDING",
                }
              });
            }
          }
        } catch (syncErr) {
          console.error("Auto replication of common document failed:", syncErr);
        }
      }

      try {
        const userDetails = await prisma.user.findUnique({ where: { id: userId } });
        const userEmail = userDetails?.email || "N/A";
        const userPhone = userDetails?.phone || "N/A";

        await alertDocumentUpload(
          finalDocumentType,
          req.file.originalname,
          req.user.name,
          userEmail,
          userPhone,
          false
        );
      } catch (err) {
        console.error("Non-fatal: failed to send admin notification", err);
      }

      console.log("[uploadDocument] Document created and linked to message:", document.id);
      res.status(201).json({ ok: true, data: document });
    } catch (dbError) {
      console.error("[uploadDocument] Database Error:", dbError);
      res.status(500).json({ ok: false, message: "Database failure during document upload." });
    }
  } catch (error) {
    console.error("Document Upload Error:", error);
    res.status(500).json({ ok: false, message: "Failed to upload document." });
  }
}

export async function getMyDocuments(req, res) {
  try {
    const userId = req.user.id;
    const documents = await prisma.userDocument.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });
    res.status(200).json({ ok: true, data: documents });
  } catch (error) {
    console.error("Get Documents Error:", error);
    res.status(500).json({ ok: false, message: "Failed to fetch documents." });
  }
}

export async function deleteDocument(req, res) {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const document = await prisma.userDocument.findUnique({
      where: { id },
    });

    if (!document) {
      return res.status(404).json({ ok: false, message: "Document not found." });
    }

    if (document.userId !== userId && req.user.role !== "ADMIN" && req.user.role !== "SUPER_ADMIN") {
      return res.status(403).json({ ok: false, message: "Unauthorized." });
    }

    // Remove from filesystem
    const filePath = path.join(process.cwd(), document.fileUrl);
    if (fs.existsSync(filePath)) {
      try {
        fs.unlinkSync(filePath);
      } catch (err) { console.error("File unlink failed:", err); }
    }

    await prisma.userDocument.delete({
      where: { id },
    });

    res.status(200).json({ ok: true, message: "Document deleted successfully." });
  } catch (error) {
    console.error("Delete Document Error:", error);
    res.status(500).json({ ok: false, message: "Failed to delete document." });
  }
}

export async function updateDocument(req, res) {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const file = req.file;

    const document = await prisma.userDocument.findUnique({ where: { id } });
    if (!document) return res.status(404).json({ ok: false, message: "Document not found." });
    if (document.userId !== userId) return res.status(403).json({ ok: false, message: "Unauthorized to update this document." });

    let fileUrl = document.fileUrl;
    let fileName = document.fileName;

    if (file) {
      // Remove old file
      const oldPath = path.join(process.cwd(), document.fileUrl);
      if (fs.existsSync(oldPath)) {
        try {
          fs.unlinkSync(oldPath);
        } catch (err) { console.error("Old file unlink failed:", err); }
      }
      fileUrl = `/uploads/${file.filename}`;
      fileName = file.originalname;
    }

    const updated = await prisma.userDocument.update({
      where: { id },
      data: {
        fileUrl,
        fileName,
        status: "PENDING", // Reset to pending after re-upload
        updatedAt: new Date(),
      }
    });

    // Notify admin about the re-upload
    if (document.messageId) {
      const oldMessage = await prisma.message.findUnique({ where: { id: document.messageId } });
      if (oldMessage) {
        const newMessage = await prisma.message.create({
          data: {
            senderId: userId,
            receiverId: oldMessage.receiverId,
            content: `${req.user.name || "A client"} re-uploaded a document: ${document.documentType} (${fileName}).`,
            registrationId: document.registrationId,
            leadId: document.leadId,
          }
        });
        
        await prisma.userDocument.update({
          where: { id },
          data: { messageId: newMessage.id }
        });
        
        updated.messageId = newMessage.id;
      }
    }

    res.status(200).json({ ok: true, data: updated });
  } catch (error) {
    console.error("Update Document Error:", error);
    res.status(500).json({ ok: false, message: "Failed to update document." });
  }
}
