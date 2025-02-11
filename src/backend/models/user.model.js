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
      enum: [
         "MES Position",
         "Ratified Club, Team, Or Program Society",
         "Student Projects and New Club Seed Funding",
         "Intramurals Funding",
         "Conference/Competition Delegate (Open or Affiliate)",
      ], // Club-specific roles
   },
   club: {
      type: String,
      required: true,
   },
   clubRole: {
      type: String,
      enum: ["member", "president", "vice-president", "treasurer", "secretary"], // Club-specific roles
   },
   payment: {
      etransferEmail: { type: String },
      etransferPhone: { type: String },
   },
   role: {
      type: String,
      enum: ["admin", "standard"],
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
