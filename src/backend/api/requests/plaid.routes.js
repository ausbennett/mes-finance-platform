const express = require('express');
const router = express.Router();

const plaidController = require('./plaid.controller')

/**
 * @route POST /api/plaid/link-token
 * @desc Generate a Plaid Link Token for a specific user
 * @access Public
 * @body { userId: string } - The unique ID of the user
 * @returns { linkToken: string } - The token used to initialize Plaid Link UI
 */
router.post('/link-token', plaidController.createLinkToken);

/**
 * @route POST /api/plaid/exchange-token
  * @desc Exchange a Public Token for an Access Token
 * @access Public
 * @body { publicToken: string } - The public token received from Plaid Link UI
 * @returns { access_token: string, item_id: string } - The access token and unique item ID for future API calls
 */
router.post('/exchange-token', plaidController.exchangePublicToken);

/**
 * @route GET /api/plaid/transactions
 * @desc Retrieve a user's transaction history from Plaid
 * @access Private
 * @query { accessToken: string, startDate: string, endDate: string }
 * @returns { transactions: array } - List of transactions between the given dates
 */
router.get('/live-transactions', plaidController.getLiveTransactions);
router.get('/cached-transactions', plaidController.getCachedTransactions)


router.get('/reconcile', plaidController.reconcile)

//FOR TESTING ONLY!
router.get('/sandbox/public-token', plaidController.getSandboxToken)

// router.get('/all', plaidController.getAllTrx)

module.exports = router;
