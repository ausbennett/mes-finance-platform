// src/services/emailer.js
const nodemailer = require('nodemailer');
require('dotenv').config();

// Configure the transporter
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: false, // Use true for port 465, false for others
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Function to generate the body of a notification email
const getNotificationEmailBody = (status, requestDetails) => {
  return `
    <h3>Your Payment/Reimbursement Request Status</h3>
    <p>Dear ${requestDetails.name},</p>
    <p>We wanted to inform you about the status of your request.</p>
    <p><strong>Status:</strong> ${status}</p>
    <p><strong>Request Details:</strong></p>
    <ul>
      <li><strong>Request ID:</strong> ${requestDetails.id}</li>
      <li><strong>Amount:</strong> ${requestDetails.amount}</li>
      <li><strong>Submitted On:</strong> ${requestDetails.submittedDate}</li>
    </ul>
    <p>If you have any questions or concerns, please feel free to contact us.</p>
    <p>Best regards,</p>
    <p>MES Finance Platform Team</p>
  `;
};

// Function to generate the body of an authentication/login email
const getAuthenticationEmailBody = (authLink) => {
  return `
    <h3>Authentication Required</h3>
    <p>Dear User,</p>
    <p>We received a request to authorize your login. Please click the link below to authenticate yourself:</p>
    <p><a href="${authLink}">Click here to authenticate</a></p>
    <p>If you did not request this login, please ignore this email.</p>
    <p>Best regards,</p>
    <p>MES Finance Platform Team</p>
  `;
};

// Function to send an email (includes notification or auth type)
const sendEmail = async (to, subject, emailType, details) => {
  let htmlBody;

  if (emailType === 'notification') {
    htmlBody = getNotificationEmailBody(details.status, details.requestDetails);
  } else if (emailType === 'authentication') {
    htmlBody = getAuthenticationEmailBody(details.authLink);
  } else {
    throw new Error('Invalid email type');
  }

  try {
    const info = await transporter.sendMail({
      from: `"MES Finance Platform" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html: htmlBody,
    });
    console.log('Email sent:', info.messageId);
    return info;
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
};

module.exports = { sendEmail };
