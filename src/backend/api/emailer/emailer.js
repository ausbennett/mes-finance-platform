// src/backend/api/emailer/emailer.js
const nodemailer = require('nodemailer');
require('dotenv').config();

// Configure transporter (no changes needed)
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// ======================
// Email Templates
// ======================
const templates = {
  // Notification Email (Reimbursement Status)
  notification: ({ status, requestDetails }) => ({
    subject: 'Request Status Updated', // Subject is now part of the template
    html: `
      <h3>Your Payment/Reimbursement Request Status</h3>
      <p>Dear ${requestDetails.firstName} ${requestDetails.lastName},</p>
      <p>We wanted to inform you about the status of your request.</p>
      <p><strong>Status:</strong> ${status}</p>
      <p><strong>Request Details:</strong></p>
      <ul>
        <li><strong>Request ID:</strong> ${requestDetails.id}</li>
        <li><strong>Amount:</strong> ${requestDetails.amount}</li>
        <li><strong>Submitted On:</strong> ${requestDetails.submittedDate}</li>
      </ul>
      <p>If you have any questions or concerns, please contact us.</p>
      <p>Best regards,<br/>MES Finance Platform Team</p>
    `,
  }),

  // Authentication Email (Ready for future use)
  authentication: ({ authLink }) => ({
    subject: 'Authenticate Your Account', // Subject is part of the template
    html: `
      <h3>Authentication Required</h3>
      <p>Dear User,</p>
      <p>We received a request to authorize your login. Click below to authenticate:</p>
      <p><a href="${authLink}">Authenticate Now</a></p>
      <p>If you did not request this, please ignore this email.</p>
      <p>Best regards,<br/>MES Finance Platform Team</p>
    `,
  }),
};

// ======================
// Send Email Function
// ======================
const sendEmail = async (to, templateType, data) => {
  try {
    // Get template details
    const template = templates[templateType](data);
    if (!template) throw new Error('Invalid email type');

    // Send email
    const info = await transporter.sendMail({
      from: `"MES Finance Platform" <${process.env.EMAIL_USER}>`,
      to,
      subject: template.subject,
      html: template.html,
    });

    console.log('Email sent:', info.messageId);
    return info;
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
};

module.exports = { sendEmail };