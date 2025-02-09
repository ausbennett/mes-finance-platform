const express = require('express');
const router = express.Router();

router.post('/', (req, res) => res.send("Placeholder for creating a club"));
router.get('/', (req, res) => res.send("Placeholder for getting all clubs"));
router.get('/:id', (req, res) => res.send("Placeholder for getting a club by ID"));
router.put('/:id', (req, res) => res.send("Placeholder for updating a club"));
router.delete('/:id', (req, res) => res.send("Placeholder for deleting a club"));

module.exports = router;