// routes/payment.routes.js
const express = require('express');
const Payment = require('../models/payment.model');
const router = express.Router();

// Create a payment
router.post('/', async (req, res) => {
  try {
    const { reimbursementId, amount, method } = req.body;
    const newPayment = new Payment({ reimbursement: reimbursementId, amount, method });
    await newPayment.save();
    res.status(201).json(newPayment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all payments
router.get('/', async (req, res) => {
  try {
    const payments = await Payment.find().populate('reimbursement');
    res.status(200).json(payments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;