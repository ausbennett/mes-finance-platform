require("dotenv").config();

// Import the Stripe library using your secret key
const Stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

// Example usage
Stripe.customers
  .create({
    email: "customer@example.com",
  })
  .then((customer) => {
    console.log("Customer created:", customer.id);
  })
  .catch((error) => {
    console.error("Error creating customer:", error);
  });

// Import Express
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const PORT = 3001;

//Stripe payment endpoint
const cors = require("cors");

const corsOptions = {
  origin: function (origin, callback) {
    const allowedOrigins = ['http://51.141.178.23:3000', 'http://localhost:3000'];

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

app.post("/api/create-payment-intent", async (req, res) => {
  try {
    const { amount } = req.body; // Amount in cents

    const paymentIntent = await Stripe.paymentIntents.create({
      amount,
      currency: "usd",
      // Optionally, add metadata or customer details
    });

    res.send({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

//TODO: connect to mongo db using mongoose

const userSchema = new mongoose.Schema({
  // id: { type: Number, required: true },
  name: { type: String, required: true },
  receipt: String,
});

//Some simple getter functions for the User Model
userSchema.methods.getName = function getName(){
  return this.name;
};

userSchema.methods.getId = function getId(){
  return this.id;
}

userSchema.methods.getReceipt = function () {
  if (this.receipt) {
    return this.receipt; // If the receipt exists, return it
  } else {
    return 'No receipt available for this user.'; // Otherwise, return an error message
  }
};

const Users = mongoose.model("Users", userSchema);

mongoose.connect("mongodb://localhost:27017/MES_finance").then(() => {
  console.log('Connected to MongoDB');
}).catch((error) => {
  console.log('Error connecting to MongoDB:', error);
});

const sample_data = [
  {
    id: 101,
    name: "Alice Johnson",
    receipt: "receipt1.csv",
  },
  {
    id: 102,
    name: "Carlos Espinoza",
    receipt: "receipt2.csv",
  },
  {
    id: 103,
    name: "Emily Nguyen",
    receipt: "receipt3.csv",
  },
  {
    id: 104,
    name: "Ravi Patel",
    receipt: "receipt4.csv",
  },
  {
    id: 105,
    name: "Fatima Omar",
    receipt: "receipt5.csv",
  },
  {
    id: 106,
    name: "Liam Wong",
    receipt: "receipt6.csv",
  },
  {
    id: 107,
    name: "Sophia Leclerc",
    receipt: "receipt7.csv",
  },
  {
    id: 108,
    name: "John Doe",
    receipt: "receipt8.csv",
  },
  {
    id: 109,
    name: "Nina Hassan",
    receipt: "receipt9.csv",
  },
  {
    id: 110,
    name: "Oscar Martinez",
    receipt: "receipt10.csv",
  },
]


app.get("/data", async (req, res) => {

  try {
    const result = await Users.find();  // Fetch all users
    res.status(200).json(result);  // Return the list of users as JSON
  } catch (err) {
    res.status(500).json({ error: 'Error fetching users', details: err.message });
  }
});

app.post("/form", async (req, res) => {

  try {
    // Destructure data from the request body
    // const {name, receipt } = {name: "Bob L'Eponge", receipt: "bikini_bottom.csv" };
    const { name, receipt } = req.body;

    // Create a new user document using the User model
    const newUser = new Users({
      name,
      receipt
    });

    // Save the new user to the MongoDB database
    await newUser.save();

    // Send a response with the created user
    res.status(201).json({ message: 'User created successfully', user: newUser });
  } catch (err) {
    res.status(400).json({ error: 'Error saving user', details: err.message });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
