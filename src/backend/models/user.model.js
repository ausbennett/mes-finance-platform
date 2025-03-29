const mongoose = require("mongoose");

//Helper Schemas
const plaidAccessTokenSchema = new mongoose.Schema(
   {
      item_id: { type: String },
      access_token: { type: String },
   },
   { _id: false }
);

//Main User Schema
const userSchema = new mongoose.Schema({
   firstName: {
      type: String,
      required: true,
   },
   lastName: {
      type: String,
      required: true,
   },
   email: {
      type: String,
      unique: true,
      required: true,
   },
   phoneNumber: {
      type: String,
      required: true,
   },
   whoAreYou: {
      type: String,
   },
   club: {
      type: String,
      required: true,
   },
   clubRole: {
      type: String,
   },
   payment: {
      etransferEmail: { type: String },
      etransferPhone: { type: String },
   },
   role: {
      type: String,
   },
   plaid: [plaidAccessTokenSchema],
   createdAt: {
      type: Date,
      default: Date.now,
   },
   updatedAt: {
      type: Date,
      default: Date.now,
   },
});

module.exports = mongoose.model("User", userSchema);
