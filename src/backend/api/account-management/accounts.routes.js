const express = require('express');
const router = express.Router();


// ----- THIS SHOULD BE IN A SEPERATE `accounts.controller.js` module --------
// some simple dirty routes for development purposes

const User = require('../../models/user.model')
const Club = require('../../models/club.model')

// Create a new user
router.post('/user', async (req, res) => {
  try {
    const { name, email, passwordHash } = req.body;

    // Create and save the user
    const newUser = await User.create({ name, email, passwordHash });
    res.status(201).json({ message: 'User created successfully', user: newUser });
  } catch (err) {
    res.status(500).json({ error: 'Failed to create user', message: err.message });
  }
});

// Create a new club
router.post('/club', async (req, res) => {
  try {
    const { name } = req.body;

    // Create and save the club
    const newClub = await Club.create({ name });
    res.status(201).json({ message: 'Club created successfully', club: newClub });
  } catch (err) {
    res.status(500).json({ error: 'Failed to create club', message: err.message });
  }
});
// ------------------------------------------------------------------------------


module.exports = router



