const User = require('../../models/user.model');

// GET all users (Admin only)
const getUsers = async (user) => {
  try {
    if (user.role !== 'Admin') {
      return { message: 'Unauthorized' };
    }
    return await User.find({});
  } catch (error) {
    console.error(error);
    return { message: error.message };
  }
};

// GET a user by ID
const getUserById = async (id) => {
  try {
    return await User.findById(id);
  } catch (error) {
    console.error(error);
    return { message: error.message };
  }
};

// CREATE a new user
const createUser = async (data) => {
  try {
    const user = new User(data);
    await user.save();
    return user;
  } catch (error) {
    console.error(error);
    return { message: error.message };
  }
};

// UPDATE a user
const updateUser = async (id, data) => {
  try {
    const user = await User.findByIdAndUpdate(id, data, { new: true });
    return user;
  } catch (error) {
    console.error(error);
    return { message: error.message };
  }
};

// DELETE a user
const deleteUser = async (id) => {
  try {
    return await User.findByIdAndDelete(id);
  } catch (error) {
    console.error(error);
    return { message: error.message };
  }
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
};
