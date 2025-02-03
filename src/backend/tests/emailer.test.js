const { sendEmail } = require('../api/emailer/emailer');

(async () => {
  try {
    await sendEmail(
      'bennea14@mcmaster.ca', // Replace with your test email
      'Test Email from MES Finance Platform',
      'This is a plain text message.',
      '<b>This is an HTML message.</b>'
    );
  } catch (error) {
    console.error('Test failed:', error);
  }
})();
