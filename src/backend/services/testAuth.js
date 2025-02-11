// if the req has a jwt token attache to it?
var jwt = require('jsonwebtoken')
const User = require('../models/user.model')
const userService = require("../api/users/users.service")

//simulate some of the JWT token workflow for development purposes
const fakeAuth = async (req,res) => {

  // get the token
  const { token } = req.query
  if (!token) { //401 if token not found
    return res.status(401).send({ message: "Unauthorized: No token provided" });
  }

  try{
    const decToken = await jwt.verify(token, 'secret')
    const verifStatus = decToken.confirmed

    //Flow for returning users
    if (verifStatus) { 
      //For a non first-time login, get the user in the DB and attach it then move next();
      const user = await User.findById(decToken.email) //Issue: does this work? If not, how can we q on the db? 
      if (!user){ //Return 404 if user not in DB
        return res.status(404).send({ message: "404: User not found" })
      }
      console.log("Returning user "+user.email+" token verified for 7 days")
      return res.status(200).json({
        message: "Authentication successful",
        userData: user
      })
    }

    //Flow for new users
    else{
      //Create a new user with the email
      const data ={
        email: decToken.email,
        firstName: "Fortnite",
        lastName: "Balls" //Im gay i like boys i kidnap autistic kids lil mosey is watching this
      }

      const newUser = userService.createUser(data)
      console.log("Created first-time user ",data.firstName," ",data.lastName," with email ",data.email) //TODO? A better create user call
      return res.status(200).json({
        message: "Authentication successful",
        userData: newUser
      })
    }
  }

  catch(error){
    return res.status(401).json({ message: "401 Unauthorized: Token is expired or invalid"})
  }
}


const addUserData = (req, res, next) => {
    req.user = {
        _id: "123",
        name: "Austin",
        email: "benena14@mcmaster.ca",
        role: "admin",
        accessToken: "1234",
    };
    console.log("Middleware executed: User data added to request");
    next(); // Call next() to move to the next middleware or route handler
};

module.exports = { addUserData, fakeAuth }
