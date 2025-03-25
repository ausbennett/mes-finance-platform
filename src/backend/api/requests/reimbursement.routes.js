const express = require('express');
const router = express.Router();
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage });
const reimbursementController = require('./reimbursement.controller');

// GET reimbursements
router.get('/', reimbursementController.getReimbursements);

// POST - include file upload middleware (expects field name "file")
router.post('/', upload.single('file'), reimbursementController.createReimbursement);

// PUT - update reimbursement (optionally with a new file)
router.put('/id/:id', upload.single('file'), reimbursementController.editReimbursement);

module.exports = router;
