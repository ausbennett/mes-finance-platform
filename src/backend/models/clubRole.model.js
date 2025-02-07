const mongoose = require('mongoose');

const clubRoleSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  club: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Club',
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

module.exports = mongoose.model('ClubRole', clubRoleSchema);