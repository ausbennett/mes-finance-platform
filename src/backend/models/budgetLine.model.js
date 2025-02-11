const mongoose = require('mongoose');

const budgetLineSchema = new mongoose.Schema({
  club: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Club',
    required: true,
  },
  amountAllocated: {
    type: Number,
    required: true,
  },
  amountSpent: {
    type: Number,
    default: 0,
  },
  purpose: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('BudgetLine', budgetLineSchema);