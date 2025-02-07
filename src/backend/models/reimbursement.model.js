const mongoose = require('mongoose');

const recipientSchema = new mongoose.Schema({
  name: { type: String, required: true }, // Recipient name
  email: { type: String, required: true }, // Optional for notifications
  amount: { type: Number, required: true }, // Amount allocated to recipient
  status: { 
    type: String, 
    enum: ["pending", "approved", "reimbursed"], 
    default: "pending" 
  },
  paymentDetails: {
    accountNumber: { type: String }, // Optional for direct reimbursements
    method: { type: String, enum: ["direct_deposit", "bank_transfer", "e-transfer", "other"] }
  }
})

const reimbursementSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  club: {
    type: String,
    // type: mongoose.Schema.Types.ObjectId,
    // ref: 'Club',
    required: true,
  },
  recipients: [recipientSchema],
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
