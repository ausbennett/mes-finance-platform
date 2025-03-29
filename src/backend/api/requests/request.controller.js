const reimbursementService = require('./reimbursement.service')
const paymentService = require('./payment.service')
const User = require('../../models/user.model'); // Add this line
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
    const { id } = req.params;
    const updateData = req.body;
    const isAdmin = req.user?.role == "admin";

    // 1. First get the request (payment or reimbursement)
    const request = await reimbursementService.getReimbursementById(id) || 
                   await paymentService.getPaymentById(id);
    
    if (!request) {
      return res.status(404).json({ error: "Request not found" });
    }

    // 2. Get the requestor's user document
    const requestor = await User.findById(request.requestor);
    if (!requestor || !requestor.email) {
      return res.status(400).json({ error: "Requestor email not found" });
    }

    const updatedPayload = {
      ...updateData,
      lastUpdated: new Date()
    }

    if (isAdmin) {
      updatedPayload.reviewer = req.user?.id;
    }

    // 3. Proceed with update
    const isPayment = updateData.amount !== undefined;
    const service = isPayment ? paymentService : reimbursementService;

    const updatedRequest = isPayment 
    ? await paymentService.editPayment(id, updatedPayload)
    : await reimbursementService.editReimbursement(id, updatedPayload)

    console.log("update request", updatedPayload)

    // 4. Send email to requestor
    await sendEmail(
      requestor.email, // Use the email from the user document
      'notification',
      {
        status: updatedRequest.status,
        requestDetails: {
          id: id,
          firstName: requestor.firstName,
          lastName: requestor.lastName,
          amount: updatedRequest.totalAmount || updatedRequest.amount,
          submittedDate: updatedRequest.createdAt,
          reviewer: req.user?.email
        }
      }
    );

    return res.status(200).json(updatedRequest);
  } catch (error) {
    console.error(`Update failed:`, error);
    return res.status(500).json({ 
      error: "Internal server error",
      details: error.message 
    });
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
