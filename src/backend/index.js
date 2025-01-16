
// Import Express
const express = require("express");
const app = express();
const PORT = 3001;

//Stripe payment endpoint
const cors = require("cors");

const corsOptions = {
  origin: function (origin, callback) {
    const allowedOrigins = ['http://localhost:3000'];

    if (allowedOrigins.includes(origin) || !origin) {
      callback(null, true); // Allow the request
    } else {
      callback(new Error('Not allowed by CORS')); // Reject the request
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type'],
};

app.use(cors(corsOptions));  // Use CORS with the custom options
app.use(express.json());


// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
