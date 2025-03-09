// tests/jest.teardown.js
const mongoose = require('mongoose');

module.exports = async () => {
  if (mongoose.connection.readyState === 1) {
    await mongoose.disconnect();
  }
};
