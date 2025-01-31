
/* REQUESTS ROUTER
 * This is where we define all the routes (endpoints) for the requests, 
 * the logic that processes the data is in the corrisponding controller module 
 * this file should look pretty simple, because this should just be a 1:1 pointer to the requestsController
*/

const express = require('express');
const router = express.Router();

const requestsController = require('./requests.controller');

// Route definitions (place holder)
// @route /api/requests/...
// GET


/**
 * @route  /api/requests
 * @desc Get all request forms returned as array of request objects
 * @access Private
 * @returns { request : Request }
 */
router.get('/', requestsController.getAllRequests);

//get requests by userID 
router.get('/:id', requestsController.getRequestById);

//get requests by clubID

//get requests by ??

router.get('/audit', requestsController.getAudits)

router.post('/', requestsController.createRequest);

//EDIT REQUEST
router.put('/:id', requestsController.editRequest )


router.post('/reimbursement', requestsController.createReimbursement)


// Plaid Specific Routes

/**
 * @route POST /api/requests/plaid/link-token
 * @desc Generate a Plaid Link Token for a specific user
 * @access Public
 * @body { userId: string } - The unique ID of the user
 * @returns { linkToken: string } - The token used to initialize Plaid Link UI
 */
router.post('/plaid/link-token', requestsController.plaidCreateLinkToken);

/**
 * @route POST /api/requests/plaid/exchange-token
  * @desc Exchange a Public Token for an Access Token
 * @access Public
 * @body { publicToken: string } - The public token received from Plaid Link UI
 * @returns { access_token: string, item_id: string } - The access token and unique item ID for future API calls
 */
router.post('/plaid/exchange-token', requestsController.plaidExchangePublicToken);

/**
 * @route GET /api/requests/plaid/transactions
 * @desc Retrieve a user's transaction history from Plaid
 * @access Private
 * @query { accessToken: string, startDate: string, endDate: string }
 * @returns { transactions: array } - List of transactions between the given dates
 *
 * reqs.body = {
 *    "accessToken" : "access-sandbox-095f8506-17d9-4351-8af6-11d6302b230c",
 *    "startDate": "2025-01-01",
 *    "endDate": "2025-02-01"
 * }
 */
router.get('/plaid/transactions', requestsController.plaidGetTransactions);

//FOR TESTING ONLY!
router.get('/sandbox/public-token', requestsController.plaidSandboxToken)


module.exports = router;
