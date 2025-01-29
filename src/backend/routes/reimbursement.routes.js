
// routes/reimbursement.routes.js
const express = require('express');
const Reimbursement = require('../models/reimbursement.model');
const router = express.Router();

// Create a new reimbursement
router.post('/', async (req, res) => {
  try {
    const { clubId, userId, amount, description } = req.body;
    const newReimbursement = new Reimbursement({ club: clubId, user: userId, amount, description });
    await newReimbursement.save();
    res.status(201).json(newReimbursement);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all reimbursements
router.get('/', async (req, res) => {
  try {
    const reimbursements = await Reimbursement.find().populate('club user');
    res.status(200).json(reimbursements);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;