const express = require('express');
const userController = require('./users.controller');

const router = express.Router();

router.get('/', userController.getUsers);         // GET all users (Admin only)
router.get('/me', userController.getMe)           //Get Current User
router.get('/:id', userController.getUserById);   // GET user by ID
router.post('/', userController.createUser);      // CREATE user
router.put('/:id', userController.updateUser);    // UPDATE user
router.delete('/:id', userController.deleteUser); // DELETE user

module.exports = router;
