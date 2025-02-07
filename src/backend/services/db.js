/* MONGODB CONNECTION SERVICE
 * Just abstracts data base connection code via mongoose
 */


const mongoose = require('mongoose')

// DEV ONLY - allows development without a mongodb instance actually running properly
const { MongoMemoryServer } = require('mongodb-memory-server')

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1); // Exit on failure
  }
};

const connectMemoryDB = async () => {
  const mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();

  await mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  console.log('Connected to in-memory MongoDB');

  return mongoServer; // Store this if you need to stop the server later
}

module.exports = { connectDB, connectMemoryDB }
