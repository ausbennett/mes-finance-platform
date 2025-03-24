const userService = require("./users.service");

// GET all users (Admin only)
const getUsers = async (req, res) => {
   const result = await userService.getUsers(req.user);
   res.status(result.message ? 403 : 200).json(result);
};

const getMe = async (req, res) => {
   console.log("REQ :", req);
   const result = await userService.getUserById(req.user._id);
   res.status(result.message ? 403 : 200).json(result);
};

// GET user by ID
const getUserById = async (req, res) => {
   const result = await userService.getUserById(req.params.id);
   res.status(result ? 200 : 404).json(result || { message: "User not found" });
};

const getUserByEmail = async (req, res) => {
   const result = await userService.getUserByEmail(req.params.email);
   res.status(result ? 200 : 404).json(result || { message: "User not found" });
};

// CREATE user
const createUser = async (req, res) => {
   const result = await userService.createUser(req.body);
   res.status(result.message ? 400 : 201).json(result);
};

// UPDATE user
const updateUser = async (req, res) => {
   const result = await userService.updateUser(req.params.id, req.body);
   res.status(result ? 200 : 404).json(result || { message: "User not found" });
};

// DELETE user
const deleteUser = async (req, res) => {
   const result = await userService.deleteUser(req.params.id);
   res.status(result ? 200 : 404).json(result || { message: "User not found" });
};

module.exports = {
   getUsers,
   getMe,
   getUserById,
   getUserByEmail,
   createUser,
   updateUser,
   deleteUser,
};
