const mongoose = require('mongoose');

module.exports = async () => {
  process.env.NODE_ENV = 'test';
  // Use mock MongoDB implementation
  await mongoose.connect('mongodb://localhost:27017/testdb', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
};
