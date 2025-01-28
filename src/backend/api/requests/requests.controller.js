/* REQUESTS CONTROLLER
 * This is where all the logic for endpoints, data processing etc, 
 * The router uses this and passes data into the functions here
 * */

const plaidService = require('../../services/plaid.service')

// request specific function templates
exports.getAllRequests = (req, res) => {
    const requests = { message: "requests"}
    res.json(requests);
};

exports.createRequest = (req, res) => {
    const newRequest = req.body;
    res.status(201).json({ message: "ur mom"});
};

exports.getRequestById = (req, res) => {
    const { id } = req.params;
    res.json({
      message: "requests id: " + id
    });
};

// PlaidAPI Functionality
exports.plaidCreateLinkToken = async (req, res) => {
  try {
    const userId = req.body.userId; // Unique user identifier
    const linkToken = await PlaidService.createLinkToken(userId);
    res.status(200).json({ linkToken });
  } catch (error) {
    console.error('Error creating Link Token:', error);
    res.status(500).json({ error: 'Failed to create Link Token' });
  }
};

exports.plaidExchangePublicToken = async (req, res) => {
  try {
    const { publicToken } = req.body;
    const { access_token, item_id } = await PlaidService.exchangePublicToken(publicToken);
    res.status(200).json({ access_token, item_id });
  } catch (error) {
    console.error('Error exchanging Public Token:', error);
    res.status(500).json({ error: 'Failed to exchange Public Token' });
  }
};

exports.plaidGetTransactions = async (req, res) => {
  try {
    const { accessToken, startDate, endDate } = req.query;
    const transactions = await PlaidService.getTransactions(accessToken, startDate, endDate);
    res.status(200).json(transactions);
  } catch (error) {
    console.error('Error fetching transactions:', error);
    res.status(500).json({ error: 'Failed to fetch transactions' });
  }
};



const reqsData = [
  {
    req_id: "r1",
    date: "2025-01-14",
    amount: 89.40, // Matches exactly with Plaid data
    type: "reimbursement",
    plaid_transaction: null,
  },
  {
    req_id: "r2",
    date: "2025-01-14",
    amount: 10.0, // Matches exactly with Plaid data
    type: "payment",
    plaid_transaction: null,
  },
  {
    req_id: "r3",
    date: "2025-01-15",
    amount: 50.0, // Near match (Plaid has 50.25)
    type: "payment",
    plaid_transaction: null,
  },
  {
    req_id: "r4",
    date: "2025-01-16",
    amount: 25.0, // Missing in Plaid data
    type: "reimbursement",
    plaid_transaction: null,
  },
  {
    req_id: "r5",
    date: "2025-01-14",
    amount: -200.0, // User error: marked as negative instead of positive
    type: "payment",
    plaid_transaction: null,
  },
];


const plaidData = [
  {
    transaction_id: "txn1",
    date: "2025-01-14",
    amount: 89.40, // Matches exactly with a reimbursement
    account_id: "acct1",
    category: ["Office Supplies"],
    pending: false,
  },
  {
    transaction_id: "txn2",
    date: "2025-01-14",
    amount: 10.0, // Matches exactly with a payment
    account_id: "acct2",
    category: ["Miscellaneous"],
    pending: false,
  },
  {
    transaction_id: "txn3",
    date: "2025-01-15",
    amount: 50.25, // Near match (slightly higher than the request)
    account_id: "acct1",
    category: ["Food and Drink"],
    pending: false,
  },
  {
    transaction_id: "txn4",
    date: "2025-01-14",
    amount: 200.0, // Matches the absolute value of a request but with opposite sign
    account_id: "acct2",
    category: ["Payroll"],
    pending: false,
  },
  {
    transaction_id: "txn5",
    date: "2025-01-17",
    amount: 300.0, // Exists in Plaid but not in requests
    account_id: "acct3",
    category: ["Travel"],
    pending: false,
  },
];

/* DATA FLOW
 * TRIGGER: admin loads ledger page
 * RETURN CACHED, while we fetch updates
 
 * Requests Controller communicates with database to get all requests
 * ``
 * than it communicates with plaid, and pulls all the transactions
 * reconcile algo does it's magic, 
 * pushes updated data back into the database
 * notify frontend to refresh
 */
reconcileData = () => {
  console.log("HELLO");
}


reconcileData()
