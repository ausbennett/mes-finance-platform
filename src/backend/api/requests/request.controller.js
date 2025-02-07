const reimbursementService = require('./reimbursement.service')
const paymentService = require('./payment.service')

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

module.exports = {
  getAllRequests
}
