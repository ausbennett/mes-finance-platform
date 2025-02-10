// if the req has a jwt token attache to it?

const User = require('../models/user.model')

//simulate some of the JWT token workflow for development purposes
const fakeAuth = async (req,res,next) => {

  // get the token
  const token = req.headers.authorization?.split(" ")[1]; // Expecting 'Bearer <token>'
  if (!token) {
    return res.status(401).json({ message: "Unauthorized: No token provided" });
  }
  
  // decrypt payload and get embedde userID
  const id = token //for now just use the userID as a token

  // call helper function to get the appropriate user information
  const user = await User.findById(id); 
  console.log("TOKEN AUTH'D USER:", user)

  req.user = {
    id: user._id,
    firstName: user.firstName,
    lastName: user.lastName,   
    email: user.email,
    role: user.role,
  };
  next();
}


const addUserData = (req, res, next) => {
    req.user = {
        id: "123",
        name: "Austin",
        email: "benena14@mcmaster.ca",
        role: "admin",
        accessToken: "1234",
    };
    console.log("Middleware executed: User data added to request");
    next(); // Call next() to move to the next middleware or route handler
};

module.exports = { addUserData, fakeAuth }
