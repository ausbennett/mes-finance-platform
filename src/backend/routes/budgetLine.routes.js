// routes/budgetLine.routes.js
const express = require('express');
const BudgetLine = require('../models/budgetLine.model');
const router = express.Router();

// Create a new budget line
router.post('/', async (req, res) => {
  try {
    const { clubId, amountAllocated, amountSpent, purpose } = req.body;
    const newBudgetLine = new BudgetLine({ club: clubId, amountAllocated, amountSpent, purpose });
    await newBudgetLine.save();
    res.status(201).json(newBudgetLine);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all budget lines
router.get('/', async (req, res) => {
  try {
    const budgetLines = await BudgetLine.find().populate('club');
    res.status(200).json(budgetLines);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;