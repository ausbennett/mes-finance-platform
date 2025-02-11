const express = require('express');
const router = express.Router();
const ClubsController = require('./clubs.controller');

router.get('/', ClubsController.getAllClubs);
router.get('/:id', ClubsController.getClubById);
router.post('/', ClubsController.createClub);
router.put('/:id', ClubsController.updateClub);
router.delete('/:id', ClubsController.deleteClub);

module.exports = router;
