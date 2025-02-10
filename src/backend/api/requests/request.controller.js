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
      'notification',
      { 
        status: newStatus,
        requestDetails: {
          id: id,
          firstName: user.firstName, // Changed
          lastName: user.lastName,   // Changed
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

const getRequestById = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Check both reimbursements and payments
    const reimbursement = await reimbursementService.getReimbursementById(id);
    const payment = await paymentService.getPaymentById(id);

    if (!reimbursement && !payment) {
      return res.status(404).json({ error: "Request not found" });
    }

    return res.status(200).json({
      request: reimbursement || payment
    });
    
  } catch (error) {
    return res.status(500).json({ 
      error: "Internal server error", 
      details: error.message 
    });
  }
};

const getRequestsByDateRange = async (req, res) => {
  try {
    const user = req.user;
    const { start, end } = req.query;

    if (!start || !end) {
      return res.status(400).json({ error: "Start date and end date are required" });
    }

    const startDate = new Date(start);
    const endDate = new Date(end);
    endDate.setUTCHours(23, 59, 59, 999);
  
    console.log(startDate, endDate)


    if (isNaN(startDate) || isNaN(endDate)) {
      return res.status(400).json({ error: "Invalid date format" });
    }

    // Fetch all reimbursements and payments
    const [reimbursements, payments] = await Promise.all([
      reimbursementService.getReimbursements(user),
      paymentService.getPayments(user),
    ]);

    // Handle errors
    if (reimbursements.message || payments.message) {
      return res.status(400).json({
        error: "Error fetching requests",
        reimbursementsError: reimbursements.message || null,
        paymentsError: payments.message || null,
      });
    }

    // Filter by date range
    const filteredReimbursements = reimbursements.filter(r => {
      if (!r.createdAt) return false;
      const createdAt = new Date(r.createdAt);
      return createdAt >= startDate && createdAt <= endDate;
    });

    const filteredPayments = payments.filter(p => {
      if (!p.createdAt) return false;
      const createdAt = new Date(p.createdAt);
      return createdAt >= startDate && createdAt <= endDate;
    });

    return res.status(200).json({ reimbursements: filteredReimbursements, payments: filteredPayments });
  } catch (error) {
    return res.status(500).json({ error: "Internal server error", details: error.message });
  }
};

module.exports = {
  getAllRequests,
  updateRequestStatus,
  getRequestById,
  getRequestsByDateRange
}
