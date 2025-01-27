const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  reimbursement: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Reimbursement',
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  paymentDate: {
    type: Date,
    default: Date.now,
  },
  method: {
    type: String,
    enum: ['E-transfer', 'Cheque', 'Cash'],
    default: 'E-transfer',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Payment', paymentSchema);