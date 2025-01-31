/* REQUESTS CONTROLLER
 * This is where all the logic for endpoints, data processing etc, 
 * The router uses this and passes data into the functions here
 * */

const { json } = require('express');

const Reimbursement = require('../../models/reimbursement.model')

const PlaidService = require('../../services/plaid.service')

exports.createReimbursement = async (req, res) => {
  try {
    // Extract required fields from the request body
    const { club, user, amount, plaid } = req.body;

    // Validate required fields
    if (!club || !user || !amount)  {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Create the reimbursement
    const newReimbursement = await Reimbursement.create({
      club,
      user,
      amount,
      status: 'Pending', // Optional; default will apply if omitted
      description: req.body.description, // Optional
    });

    res.status(201).json(newReimbursement);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create reimbursement', message: error.message });
  }
};


// request specific function templates
exports.getAllRequests = (req, res) => {
    const requests = { message: "requests"}
    res.json(requests);
};

exports.createRequest = (req, res) => {
    const newRequest = req.body;
    res.status(201).json({ message: "ur mom"});
};


exports.getAudits = (req, res) => {
    const newRequest = req.body;
    res.status(201).json({ message: "ur mom"});
};

exports.getRequestById = (req, res) => {
    const { id } = req.params;
    res.json({
      message: "requests id: " + id
    });
};

exports.editRequest = (req, res) => {
  try {
    const { id } = req.params; 

    //access the database and fetch the request data
  } catch (error) {
    console.log('Error', error.data) 
    res.status(500).json(error)
  }
  //return the new request
  res.status(500).json({ message: "ur mom"})
}

// Plaid Functionality
exports.plaidSandboxToken = async (req,res) => {
  try {
    const response = await PlaidService.client.sandboxPublicTokenCreate({
      institution_id: 'ins_109508', // Example institution ID
      initial_products: ['transactions'], // Products to enable
    })
    res.status(200).json(response.data.public_token)
  } catch (error) {
    console.log('Error', error.data) 
    res.status(500).json(error)
  }
}

exports.plaidCreateLinkToken = async (req, res) => {
  try {
    const userId = req.body.userId; // Unique user identifier
    const linkToken = await PlaidService.createLinkToken(userId);
    res.status(200).json({ linkToken });
  } catch (error) {
    console.error('Error creating Link Token:', error.data);
    res.status(500).json({ error: 'Failed to create Link Token' });
  }
};

exports.plaidExchangePublicToken = async (req, res) => {
  try {
    const { publicToken } = req.body;
    const { access_token, item_id } = await PlaidService.exchangePublicToken(publicToken);
    res.status(200).json({ access_token, item_id });
  } catch (error) {
    console.error('Error exchanging Public Token:', error.data);
    res.status(500).json({ error: 'Failed to exchange Public Token' });
  }
};

exports.plaidGetTransactions = async (req, res) => {
  try {
    const { accessToken, startDate, endDate } = req.body;
    const transactions = await PlaidService.getTransactions(accessToken, startDate, endDate);
    res.status(200).json(transactions);
  } catch (error) {
    console.error('Error fetching transactions:', error.data);
    res.status(500).json({ error: 'Failed to fetch transactions' });
  }
};


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
exports.reconcileData = (plaidData, reqsData) => {

    const groupByDateAndAmount = (data) => {
        return data.reduce((acc, item) => {
            const key = `${item.date}-${item.amount}`;
            if (!acc[key]) {
                acc[key] = [];
            }
            acc[key].push(item);
            return acc;
        }, {});
    };

    const plaidGrouped = groupByDateAndAmount(plaidData);
    const reqsGrouped = groupByDateAndAmount(reqsData);

    // Reconcile
    Object.keys(reqsGrouped).forEach((key) => {

        if (plaidGrouped[key] && plaidGrouped[key].length >= reqsGrouped[key].length) {
            // Mark all requests in this group as reconciled
            reqsGrouped[key].forEach((req) => {
                req.status = 'Reconciled'; // Generic reconciliation marker
                req.plaid_transaction = '??'
            });

            // Optionally, remove used transactions if one-to-one is needed later
            // plaidGrouped[key].splice(0, reqsGrouped[key].length);

        } else {
            // Mark as unreconciled if not enough transactions
            reqsGrouped[key].forEach((req) => {
                req.plaid_transaction = null; // Not reconciled
            });
        }
    });

    // Flatten the reconciled request groups back into an array
    return Object.values(reqsGrouped).flat();
} 



