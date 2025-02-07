const mongoose = require('mongoose');

// if I was a club entity who owed money i would need
// who created the request
// who we need to pay (do they need accounts not really)

const paymentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
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

module.exports = mongoose.model('Payment', paymentSchema);
