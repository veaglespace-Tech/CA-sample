import { sendAdminNotification } from "../utils/mailer.js";

function safeStringify(obj) {
  if (!obj) return "";
  if (typeof obj === 'string') return obj;
  try { return JSON.stringify(obj); } catch { return ""; }
}

function formatMetadataAsHtml(obj) {
  if (!obj) return "";
  if (typeof obj === 'string') {
    try { obj = JSON.parse(obj); } catch { return obj; }
  }
  if (typeof obj !== 'object' || obj === null) return String(obj);
  
  const items = Object.entries(obj)
    .filter(([_, v]) => v !== undefined && v !== null && v !== "")
    .map(([k, v]) => {
      const formattedKey = k.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
      return `<li style="margin-bottom: 4px;"><strong>${formattedKey}:</strong> ${v}</li>`;
    });
    
  if (items.length === 0) return "";
  return `<ul style="margin: 8px 0; padding-left: 20px; color: #475569;">${items.join('')}</ul>`;
}

export async function alertNewLead(lead) {
  try {
    await sendAdminNotification(
      `New Lead Received: ${lead.fullName}`,
      `
      <p><strong>Name:</strong> ${lead.fullName}</p>
      <p><strong>Phone:</strong> ${lead.phone}</p>
      <p><strong>Email:</strong> ${lead.email || "N/A"}</p>
      <p><strong>Service:</strong> ${lead.serviceName || "N/A"}</p>
      <p><strong>Source:</strong> ${lead.source}</p>
      ${lead.city ? `<p><strong>City:</strong> ${lead.city}</p>` : ""}
      ${lead.businessName ? `<p><strong>Business Name:</strong> ${lead.businessName}</p>` : ""}
      ${lead.preferredTime ? `<p><strong>Preferred Time:</strong> ${lead.preferredTime}</p>` : ""}
      ${lead.message ? `<p><strong>Message:</strong> ${lead.message}</p>` : ""}
      ${lead.metadata ? `<div><strong>Extra Info:</strong> ${formatMetadataAsHtml(lead.metadata)}</div>` : ""}
      `
    );
  } catch (err) { console.error("Non-fatal: failed to send admin notification", err); }
}

export async function alertNewRegistration(lead) {
  try {
    await sendAdminNotification(
      `New Registration Lead: ${lead.fullName}`,
      `
      <p><strong>Name:</strong> ${lead.fullName}</p>
      <p><strong>Phone:</strong> ${lead.phone}</p>
      <p><strong>Email:</strong> ${lead.email || "N/A"}</p>
      <p><strong>Service:</strong> ${lead.serviceName || "N/A"}</p>
      <p><strong>Registration Type:</strong> ${lead.registrationType}</p>
      ${lead.city ? `<p><strong>City:</strong> ${lead.city}</p>` : ""}
      ${lead.state ? `<p><strong>State:</strong> ${lead.state}</p>` : ""}
      ${lead.pinCode ? `<p><strong>Pin Code:</strong> ${lead.pinCode}</p>` : ""}
      ${lead.address ? `<p><strong>Address:</strong> ${lead.address}</p>` : ""}
      ${lead.businessName ? `<p><strong>Business Name:</strong> ${lead.businessName}</p>` : ""}
      ${lead.natureOfBusiness ? `<p><strong>Nature of Business:</strong> ${lead.natureOfBusiness}</p>` : ""}
      ${lead.message ? `<p><strong>Message:</strong> ${lead.message}</p>` : ""}
      ${lead.metadata ? `<div><strong>Extra Info:</strong> ${formatMetadataAsHtml(lead.metadata)}</div>` : ""}
      `
    );
  } catch (err) { console.error("Non-fatal: failed to send admin notification", err); }
}

export async function alertContactQuery(query) {
  try {
    await sendAdminNotification(
      `New Contact Query: ${query.subject}`,
      `
      <p><strong>Name:</strong> ${query.name}</p>
      <p><strong>Email:</strong> ${query.email || "N/A"}</p>
      <p><strong>Phone:</strong> ${query.phone}</p>
      <p><strong>Message:</strong> ${query.message}</p>
      `
    );
  } catch (err) { console.error("Non-fatal: failed to send admin notification", err); }
}

export async function alertNewReferral(data) {
  try {
    await sendAdminNotification(
      `New Referral Submission`,
      `
      <p><strong>Referrer:</strong> ${data.referrerName} (${data.referrerPhone})</p>
      <p><strong>Friend:</strong> ${data.friendName} (${data.friendPhone})</p>
      <p><strong>Service:</strong> ${data.serviceName || data.service || "N/A"}</p>
      `
    );
  } catch (err) { console.error("Non-fatal: failed to send admin notification", err); }
}

export async function alertEventRegistration(event, data) {
  try {
    await sendAdminNotification(
      `New Event Registration: ${event.title}`,
      `
      <p><strong>Event:</strong> ${event.title}</p>
      <p><strong>Name:</strong> ${data.name}</p>
      <p><strong>Email:</strong> ${data.email}</p>
      <p><strong>Phone:</strong> ${data.phone}</p>
      `
    );
  } catch (err) { console.error("Non-fatal: failed to send admin notification", err); }
}

export async function alertDocumentUpload(docType, fileName, clientName, userEmail, userPhone, isLink = false) {
  try {
    await sendAdminNotification(
      isLink ? `Document Linked: ${docType}` : `New Document Uploaded: ${docType}`,
      `
      <p><strong>Client:</strong> ${clientName || "A client"}</p>
      <p><strong>Email:</strong> ${userEmail || "N/A"}</p>
      <p><strong>Phone:</strong> ${userPhone || "N/A"}</p>
      <p><strong>Document Type:</strong> ${docType}</p>
      <p><strong>File Name:</strong> ${fileName}</p>
      ${isLink ? '<p>The client used an existing document for a new service requirement.</p>' : ''}
      `
    );
  } catch (err) { console.error("Non-fatal: failed to send admin notification", err); }
}

export async function alertClientMessage(clientName, userEmail, userPhone, messageContent) {
  try {
    await sendAdminNotification(
      `New Message from Client: ${clientName}`,
      `
      <p><strong>Client:</strong> ${clientName}</p>
      <p><strong>Email:</strong> ${userEmail || "N/A"}</p>
      <p><strong>Phone:</strong> ${userPhone || "N/A"}</p>
      <p><strong>Message:</strong> ${messageContent}</p>
      `
    );
  } catch (err) { console.error("Non-fatal: failed to send admin notification", err); }
}
