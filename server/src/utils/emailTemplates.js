export function getPaymentSuccessEmailHtml({
  userName,
  serviceTitle,
  loginEmail,
  tempPassword,
  loginUrl,
  isNewUser,
  leadName,
  leadPhone,
  paymentAmount,
}) {
  let loginBox = "";
  if (isNewUser) {
    loginBox = `
      <div style="background: #f8fafc; padding: 15px; border-radius: 8px; margin: 20px 0; border: 1px solid #e2e8f0;">
        <p style="margin: 5px 0;"><strong>Login Email:</strong> ${loginEmail}</p>
        <p style="margin: 5px 0;"><strong>Temporary Password:</strong> ${tempPassword}</p>
      </div>
      <p><em>* We strongly recommend changing your password (using the 'Forgot Password' link) after your first login.</em></p>
    `;
  } else {
    loginBox = `
      <div style="background: #f8fafc; padding: 15px; border-radius: 8px; margin: 20px 0; border: 1px solid #e2e8f0;">
        <p style="margin: 5px 0;"><strong>Login Email:</strong> ${loginEmail}</p>
        <p style="margin: 5px 0; font-size: 13px;"><em>(Use your existing password to log in. If you forgot it, click 'Forgot Password' on the login page.)</em></p>
      </div>
    `;
  }

  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
      <h2 style="color: #4f46e5;">Payment Received!</h2>
      <p>Hi ${userName},</p>
      <p>Thank you for choosing Your Company Name. Your payment for <strong>${serviceTitle}</strong> has been successfully processed and your registration is now complete.</p>
      <p>You can track the progress of this service, view updates, and access your invoice directly from your secure dashboard.</p>
      
      ${loginBox}
      
      <h3 style="color: #333; margin-top: 25px; border-bottom: 1px solid #e2e8f0; padding-bottom: 5px;">Your Service Details</h3>
      <div style="background: #fdfdfd; padding: 15px; border-radius: 8px; border: 1px solid #e2e8f0; font-size: 14px; line-height: 1.6;">
        <p style="margin: 5px 0;"><strong>Name:</strong> ${leadName || "N/A"}</p>
        <p style="margin: 5px 0;"><strong>Email:</strong> ${loginEmail}</p>
        <p style="margin: 5px 0;"><strong>Phone:</strong> ${leadPhone}</p>
        <p style="margin: 5px 0;"><strong>Service:</strong> ${serviceTitle}</p>
        ${paymentAmount ? `<p style="margin: 5px 0;"><strong>Amount Paid:</strong> Rs. ${paymentAmount}</p>` : ""}
      </div>
      
      <p style="margin-top: 20px;">You can login here: <a href="${loginUrl}" style="color: #4f46e5; font-weight: bold;">Login to your Dashboard</a></p>
      <hr style="margin: 30px 0; border: none; border-top: 1px solid #e2e8f0;" />
      <p style="font-size: 12px; color: #64748b;">If you have any questions, please reply to this email.</p>
    </div>
  `;
}
