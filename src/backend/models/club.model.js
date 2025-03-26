const mongoose = require("mongoose");

const clubSchema = new mongoose.Schema({
   name: {
      type: String,
   },
   description: {
      type: String,
   },
   clubRole: {
      type: String,
   },
   whoAreYou: {
      type: String,
      required: true,
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

module.exports = mongoose.model("Club", clubSchema);
