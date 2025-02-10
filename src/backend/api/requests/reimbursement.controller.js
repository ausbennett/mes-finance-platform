
const reimbursementService = require('./reimbursement.service')
const gridfsService = require('../../services/gridfs.service')

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
  try {
    let fileId = null;
    if (req.file) {
      // Upload file to GridFS and get its file ID.
      fileId = await gridfsService.uploadFile(req.file);
    }
    const reimbursementData = {
      requestor: req.user._id,
      ...req.body,
      fileId, // attach the GridFS file id (could be null if no file provided)
    };
    console.log('Creating reimbursement with data:', reimbursementData);
    const reimbursement = await reimbursementService.createReimbursement(reimbursementData);
    return res.status(reimbursement.message ? 400 : 201).json(reimbursement);
  } catch (error) {
    console.error('Error in createReimbursement:', error);
    return res.status(500).json({ message: error.message });
  }
};

// PUT - Edits an existing reimbursement
const editReimbursement = async (req, res) => {
  try {
    const { id } = req.params;
    const reimbursementData = { ...req.body };

    if (req.file) {
      // Upload new file to GridFS and attach its ID.
      const fileId = await gridfsService.uploadFile(req.file);
      reimbursementData.fileId = fileId;
    }

    const reimbursement = await reimbursementService.editReimbursement(id, reimbursementData);
    return res.status(reimbursement.message ? 400 : 200).json(reimbursement);
  } catch (error) {
    console.error('Error in editReimbursement:', error);
    return res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getReimbursements,
  createReimbursement,
  editReimbursement,
};

