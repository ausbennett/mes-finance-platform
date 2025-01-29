// routes/clubRole.routes.js
const express = require('express');
const ClubRole = require('../models/clubRole.model');
const router = express.Router();

// Create a new role for a club
router.post('/', async (req, res) => {
  try {
    const { name, clubId } = req.body;
    const newRole = new ClubRole({ name, club: clubId });
    await newRole.save();
    res.status(201).json(newRole);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all roles
router.get('/', async (req, res) => {
  try {
    const roles = await ClubRole.find().populate('club');
    res.status(200).json(roles);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete a role
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await ClubRole.findByIdAndDelete(id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;