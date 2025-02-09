const ClubService = require('./clubs.service');

const getAllClubs = async (req, res) => {
  try {
    const clubs = await ClubService.getAllClubs();
    res.status(200).json(clubs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getClubById = async (req, res) => {
  try {
    const club = await ClubService.getClubById(req.params.id);
    if (!club) {
      return res.status(404).json({ message: "Club not found" });
    }
    res.status(200).json(club);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createClub = async (req, res) => {
  try {
    const club = await ClubService.createClub(req.body);
    res.status(201).json(club);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const updateClub = async (req, res) => {
  try {
    const club = await ClubService.updateClub(req.params.id, req.body);
    if (!club) {
      return res.status(404).json({ message: "Club not found" });
    }
    res.status(200).json(club);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteClub = async (req, res) => {
  try {
    const club = await ClubService.deleteClub(req.params.id);
    if (!club) {
      return res.status(404).json({ message: "Club not found" });
    }
    res.status(200).json({ message: "Club deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getAllClubs, getClubById, createClub, updateClub, deleteClub };
