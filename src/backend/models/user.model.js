const mongoose = require('mongoose');

const plaidAccessTokenSchema = new mongoose.Schema({
  "item_id": {type: String},
  "access_token": {type: String}
}, { _id: false })

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    unique: true,
    required: true,
  },
  role: {
    type: String,
    enum: ['student', 'admin', 'approver'],
    default: 'student',
  },
  plaid: [ plaidAccessTokenSchema ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('User', userSchema);
