// if the req has a jwt token attache to it?

const User = require("../models/user.model");

//simulate some of the JWT token workflow for development purposes
const fakeAuth = async (req, res, next) => {

    if (process.env.NODE_ENV === 'test') {
      if (req.headers['test-user']) {
        req.user = JSON.parse(req.headers['test-user']);
        return next();
      }
      return res.status(401).json({ message: "Unauthorized" });
    }


   // get the token
   const token = req.headers.authorization?.split(" ")[1]; // Expecting 'Bearer <token>'
   if (!token) {
      return res
         .status(401)
         .json({ message: "Unauthorized: No token provided" });
   }

   // decrypt payload and get embedde userID
   const id = token; //for now just use the userID as a token

   // call helper function to get the appropriate user information
   
   console.log("testAUTH: looking for user with id: ", id)
   const user = await User.findById(id);
   if (!user) {
      //Return 404 if user not in DB
      return res
         .status(404)
         .json({ message: "404: User not found in database" });
   }
   ////TODO: Check for (un)confirmed email
   /*
    const confStatus = await user.someMethodToCheckIfEmailHasBeenConfirmed
    if (!confStatus){
      return res.status(400).json({ message: "400: User's email has not been confirmed"})
    }
    */

   console.log("testAUTH: TOKEN AUTH'D USER:", user.id);

   req.user = user;
   next();
};

const addUserData = (req, res, next) => {
   req.user = {
      id: "123",
      firstName: "Austin", // Changed
      lastName: "Benena", // Changed
      email: "benena14@mcmaster.ca",
      role: "admin",
   };
   console.log("Middleware executed: User data added to request");
   next();
};

module.exports = { addUserData, fakeAuth };
