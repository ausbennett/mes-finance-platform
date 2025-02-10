const reimbursementService = require('./reimbursement.service')
const paymentService = require('./payment.service')
const { sendEmail } = require('../emailer/emailer'); // Add this

const getAllRequests = async (req,res) => {
  try {
    const user = req.user;

    // Fetch reimbursements and payments concurrently
    const [reimbursements, payments] = await Promise.all([
      reimbursementService.getReimbursements(user),
      paymentService.getPayments(user),
    ]);

    // Handle errors separately
    if (reimbursements.message || payments.message) {
      return res.status(400).json({
        error: "Error fetching requests",
        reimbursementsError: reimbursements.message || null,
        paymentsError: payments.message || null,
      });
    }

    // Combine results into a single array
    return res.status(200).json({reimbursements, payments});
  } catch (error) {
    return res.status(500).json({ error: "Internal server error", details: error.message });
  }
}

const updateRequestStatus = async (req, res) => {
  try {
    const { id } = req.params
    const { newStatus } = req.body;
    const user = req.user;

    // 1. Update request status in the database (pseudo-code)
    const updatedRequest = await reimbursementService.editReimbursement(id, newStatus);
    console.log(updatedRequest)

    // 2. Send email notification
    await sendEmail(
      user.email,
      'notification', // Template type (no longer pass subject)
      { 
        status: newStatus,
        requestDetails: {
          id: id,
          name: user.name, // Ensure user.name exists!
          amount: updatedRequest.totalAmount,
          submittedDate: updatedRequest.createdAt,
        }
      }
    );

    res.status(200).json({ message: "Status updated and email sent" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getAllRequests,
  updateRequestStatus
}
