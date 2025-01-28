
/* REQUESTS ROUTER
 * This is where we define all the routes (endpoints) for the requests, 
 * the logic that processes the data is in the corrisponding controller module 
 * this file should look pretty simple, because this should just be a 1:1 pointer to the requestsController
*/

const express = require('express');
const router = express.Router();

const requestsController = require('./requests.controller');

// Route definitions (place holder)
router.get('/', requestsController.getAllRequests);
router.post('/', requestsController.createRequest);
router.get('/:id', requestsController.getRequestById);

// Plaid Specific Routes

// body.userID needed for this
router.post('/plaid/link-token', requestsController.plaidCreateLinkToken);

router.post('/plaid/exchange-token', requestsController.plaidExchangePublicToken);
router.get('/plaid/transactions', requestsController.plaidGetTransactions);


module.exports = router;
