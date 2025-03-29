const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({
   requestor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
   },
   club: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Club",
      required: true,
   },
   reviewer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
   },
   amount: {
      type: Number,
      required: true,
   },
   description: {
      type: String,
   },
   status: {
      type: String,
      enum: ["Pending", "Approved", "Rejected"],
      default: "Pending",
   },
   paymentDate: {
      type: Date,
      default: Date.now,
   },
   paymentDetails: {
      accountNumber: { type: String },
      method: { type: String, enum: ["direct_deposit", "e-transfer", "other"] },
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
      },
   },
});

module.exports = mongoose.model("Payment", paymentSchema);
