// src/tests/emailer.test.js
const { sendEmail } = require('../api/emailer/emailer');

// Test 1: Send Notification Email (Payment/Reimbursement Status)
(async () => {
  try {
    const result = await sendEmail(
      'bennea14@mcmaster.ca', // Replace with your test email
      'Payment/Reimbursement Request Status: Approved',
      'notification',
      {
        status: 'Approved',
        requestDetails: {
          name: 'John Doe',
          id: '12345',
          amount: '$200.00',
          submittedDate: '2025-02-03',
        },
      }
    );
    console.log('Test 1 Passed: Notification email sent successfully', result);
  } catch (error) {
    console.error('Test 1 Failed:', error);
  }
})();

// Test 2: Send Authentication/Login Email
(async () => {
  try {
    const result = await sendEmail(
      'bennea14@mcmaster.ca', // Replace with your test email
      'Please Authenticate Your Login',
      'authentication',
      {
        authLink: 'https://your-app.com/authenticate?token=unique-auth-token',
      }
    );
    console.log('Test 2 Passed: Authentication email sent successfully', result);
  } catch (error) {
    console.error('Test 2 Failed:', error);
  }
})();
