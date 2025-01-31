const mongoose = require('mongoose');

const reimbursementSchema = new mongoose.Schema({
  club: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Club',
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ['Pending', 'Approved', 'Rejected'],
    default: 'Pending',
  },
  description: {
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
  plaid: {
    transactionId: {
      type: String,
    },
    accountId: {
      type: String,
    },
    transactionAmount: {
      type: Number,
    },
    isReconciled: {
      type: Boolean,
      default: false,
    }
  },
});

module.exports = mongoose.model('Reimbursement', reimbursementSchema);
