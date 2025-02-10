const mongoose = require('mongoose');

//because a reimbursement request can contain multiple recipients
const recipientSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  amount: { type: Number, required: true },
  status: { 
    type: String, 
    enum: ["pending", "approved", "reimbursed"], 
    default: "pending" 
  },
}, { _id: false })

const reimbursementSchema = new mongoose.Schema({
  requestor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  reviewer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  club: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Club',
    required: true,
  },
  recipients: [recipientSchema],
  totalAmount: {
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
  fileId: {
    type: mongoose.Schema.Types.ObjectId,
  },
});

module.exports = mongoose.model('Reimbursement', reimbursementSchema);
