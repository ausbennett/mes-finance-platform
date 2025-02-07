
const reimbursementService = require('./reimbursement.service')

// GET
// - handles based off RBAC via the JWT
//
const getReimbursements = async (req, res) => {
  const user = req.user; // assuming user info is added in middleware (e.g., from JWT)
  const reimbursements = await reimbursementService.getReimbursements(user);
  return res.status(reimbursements.message ? 400 : 200).json(reimbursements);
};

// POST - Creates a new reimbursement
const createReimbursement = async (req, res) => {
  const reimbursementData = req.body; // assumes the body contains reimbursement data
  const reimbursement = await reimbursementService.createReimbursement(reimbursementData);
  return res.status(reimbursement.message ? 400 : 201).json(reimbursement);
};

// PUT - Edits an existing reimbursement
const editReimbursement = async (req, res) => {
  const { id } = req.params; // ID of the reimbursement to update
  const reimbursementData = req.body; // assuming the body contains the updated data
  const reimbursement = await reimbursementService.editReimbursement(id, reimbursementData);
  return res.status(reimbursement.message ? 400 : 200).json(reimbursement);
};

module.exports = {
  getReimbursements,
  createReimbursement,
  editReimbursement,
};

