const express = require('express');
const Club = require('../models/club.model'); // Assuming you have a Club model
const router = express.Router();

// Create a new club
router.post('/clubs', async (req, res) => {
  try {
    const { name, description } = req.body;
    const newClub = new Club({ name, description });
    await newClub.save();
    res.status(201).json(newClub);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all clubs
router.get('/clubs', async (req, res) => {
  try {
    const clubs = await Club.find();
    res.status(200).json(clubs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update a club
router.put('/clubs/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;
    const updatedClub = await Club.findByIdAndUpdate(id, { name, description }, { new: true });
    res.status(200).json(updatedClub);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete a club
router.delete('/clubs/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await Club.findByIdAndDelete(id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;