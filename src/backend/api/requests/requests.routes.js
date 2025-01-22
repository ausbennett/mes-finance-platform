
/* REQUESTS ROUTER
 * This is where we define all the routes (endpoints) for the requests, 
 * the logic that processes the data is in the corrisponding controller module 
*/

const express = require('express');
const router = express.Router();

const requestsController = require('./requests.controller');

// Route definitions
router.get('/', requestsController.getAllRequests);
router.post('/', requestsController.createRequest);
router.get('/:id', requestsController.getRequestById);

module.exports = router;
