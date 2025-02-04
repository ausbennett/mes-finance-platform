
const reimbursementService = require('./reimbursement.service')

// GET
// - handles based off RBAC via the JWT
//
const getReimbursements = async (req, res) => {
  // const user = req.user; // assuming user info is added in middleware (e.g., from JWT)
  const user = req.body.user

  const reimbursements = await reimbursementService.getReimbursements(user);

  if (reimbursements.message) {
    return res.status(400).json(reimbursements); // error message
  }

  return res.status(200).json(reimbursements); // success
};

// POST - Creates a new reimbursement
const createReimbursement = async (req, res) => {
  const reimbursementData = req.body; // assuming the body contains reimbursement data
  const reimbursement = await reimbursementService.createReimbursement(reimbursementData);

  if (reimbursement.message) {
    return res.status(400).json(reimbursement); // error message
  }

  return res.status(201).json(reimbursement); // success, created
};

// PUT - Edits an existing reimbursement
const editReimbursement = async (req, res) => {
  const { id } = req.params; // ID of the reimbursement to update
  const reimbursementData = req.body; // assuming the body contains the updated data

  const reimbursement = await reimbursementService.editReimbursement(id, reimbursementData);

  if (reimbursement.message) {
    return res.status(400).json(reimbursement); // error message
  }

  return res.status(200).json(reimbursement); // success, updated
};

module.exports = {
  getReimbursements,
  createReimbursement,
  editReimbursement,
};

