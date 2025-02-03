const nodemailer = require('nodemailer');
require('dotenv').config();

// Configure the transporter
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,      // Gmail's SMTP host
  port: process.env.EMAIL_PORT,      // Port 587 for TLS or 465 for SSL
  secure: false, // Use true for port 465 (SSL), false for other ports
  auth: {
    user: process.env.EMAIL_USER,    // Gmail address
    pass: process.env.EMAIL_PASS,    // Gmail app password (or your password if 2FA is off)
  },
});

// Function to send an email
const sendEmail = async (to, subject, text, html) => {
  try {
    const info = await transporter.sendMail({
      from: `"MES Finance Platform" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text,
      html,
    });
    console.log('Email sent:', info.messageId);
    return info;
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
};

console.log(process.env.EMAIL_HOST); // Should print "smtp.gmail.com"
console.log(process.env.EMAIL_PORT); // Should print "587"
console.log(process.env.EMAIL_USER); // Should print your email
console.log(process.env.EMAIL_PASS); // Should print your app password


module.exports = { sendEmail };
