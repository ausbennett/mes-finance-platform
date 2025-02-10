/* MONGODB CONNECTION SERVICE */
const mongoose = require('mongoose');

// For MongoDB Atlas (Production/Development)
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, { // Rename MONGO_URI → MONGODB_URI
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`Connected to MongoDB Atlas: ${mongoose.connection.host}`);
  } catch (error) {
    console.error(`Atlas Connection Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
