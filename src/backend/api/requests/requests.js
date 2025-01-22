// this is the main "entry" point into the requests api:
// api/requests/requests.js
const express = require('express');
const router = express.Router();

// Example GET route
router.get('/', (req, res) => {
    res.json({ message: 'List of requests' });
});

// Example POST route
router.post('/', (req, res) => {
    const data = req.body; // Access request body
    res.json({ message: 'Request received', data });
});

// Example GET route with parameter
router.get('/:id', (req, res) => {
    const { id } = req.params; // Access ID from the URL
    res.json({ message: `Request with ID: ${id}` });
});

// Export the router
module.exports = router;
