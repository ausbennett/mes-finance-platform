const express = require('express');
const router = express.Router();

const plaidController = require('./plaid.controller')

/**
 * @route POST /api/requests/plaid/link-token
 * @desc Generate a Plaid Link Token for a specific user
 * @access Public
 * @body { userId: string } - The unique ID of the user
 * @returns { linkToken: string } - The token used to initialize Plaid Link UI
 */
router.post('/plaid/link-token', plaidController.createLinkToken);

/**
 * @route POST /api/requests/plaid/exchange-token
  * @desc Exchange a Public Token for an Access Token
 * @access Public
 * @body { publicToken: string } - The public token received from Plaid Link UI
 * @returns { access_token: string, item_id: string } - The access token and unique item ID for future API calls
 */
router.post('/plaid/exchange-token', plaidController.exchangePublicToken);

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
router.get('/plaid/transactions', plaidController.getTransactions);

//FOR TESTING ONLY!
router.get('/sandbox/public-token', plaidController.getSandboxToken)


module.exports = router;
