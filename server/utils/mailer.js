import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  pool: true,          // Reuse connections instead of reconnecting each time
  maxConnections: 3,   // Keep up to 3 concurrent connections
  maxMessages: 100,    // Reuse connection for up to 100 messages
  rateDelta: 1000,     // Throttle to avoid Gmail rate limits
  rateLimit: 5,        // Max 5 messages per rateDelta window
  auth: {
    user: process.env.SMTP_USER || "singareakshay937@gmail.com",
    pass: (process.env.SMTP_PASS || "fhql wslt tflu tzly").replace(/\s/g, ""),
  },
});

export async function sendEmail({ to, subject, html, attachments }) {
  try {
    const info = await transporter.sendMail({
      from: `"Veagle Space Technology Pvt. Ltd." <${process.env.SMTP_USER || "singareakshay937@gmail.com"}>`,
      to,
      subject,
      html,
      attachments,
    });
    console.log("Email sent:", info.messageId);
    return info;
  } catch (error) {
    console.error("Error sending email:", error);
    throw new Error("Failed to send email");
  }
}

export async function sendAdminNotification(subject, html) {
  const adminEmail = process.env.ADMIN_NOTIFICATION_EMAIL;
  if (!adminEmail) return;
  
  try {
    await sendEmail({
      to: adminEmail,
      subject: `[Admin Alert] ${subject}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
          <h2 style="color: #4f46e5; margin-top: 0;">Veagle Space Technology Pvt. Ltd. Admin Notification</h2>
          <div style="margin-top: 20px; font-size: 15px; color: #334155; line-height: 1.6;">
            ${html}
          </div>
          <hr style="margin-top: 30px; border: none; border-top: 1px solid #e2e8f0;" />
          <p style="font-size: 12px; color: #94a3b8; text-align: center;">This is an automated notification from your Veagle Space Technology Pvt. Ltd. system.</p>
        </div>
      `,
    });
  } catch (err) {
    console.error("Failed to send admin notification:", err);
  }
}
