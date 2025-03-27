
const {PlaidService, getAll, addTransaction} = require('./plaid.service')


const plaidService = new PlaidService()
const userService = require('../users/users.service');


/* PLAID SERVICE LOGIC
 *
 * provides a link token for UI auth
 * accepts and exchanges a public token
 * returns a access token
 * */
const getSandboxToken = async (req,res) => {
  try {
    const response = await plaidService.client.sandboxPublicTokenCreate({
      institution_id: 'ins_109508', // Example institution ID
      initial_products: ['transactions'], // Products to enable
    })
    res.status(200).json(response.data.public_token)
  } catch (error) {
    console.log('Error', error.data) 
res.status(500).json(error)
  }
}

const createLinkToken = async (req, res) => {
  try {
    const userId = req.user._id; 
    const linkToken = await plaidService.createLinkToken(userId);
    res.status(200).json({ linkToken });
  } catch (error) {
    console.error('Error creating Link Token:', error);
    res.status(500).json({ error: 'Failed to create Link Token' });
  }
};

const exchangePublicToken = async (req, res) => {
  try {
    const userId = req.user._id 
    const { publicToken } = req.body;
    const { access_token, item_id } = await plaidService.exchangePublicToken(publicToken);
  
    //once access_token is recieved, store this bad boy in the users database by PUT request
    const newUser = await userService.updateUser(userId, { $push: { plaid: { access_token, item_id }}}) 
    console.log(newUser)

    res.status(200).json({ access_token, item_id });
  } catch (error) {
    console.error('Error exchanging Public Token:', error);
    res.status(500).json({ error: 'Failed to exchange Public Token' });
  }
};

const getLiveTransactions = async (req, res) => {
  try {
    const { start, end, accessToken } = req.query;
    const transactions = await plaidService.getLiveTransactions(accessToken, start, end);
    res.status(200).json(transactions);
  } catch (error) {
    console.error('Error fetching transactions:', error);
    res.status(500).json({ error: 'Failed to fetch transactions' });
  }
};

const getCachedTransactions  = async (req, res) => {
  try {

    const { start, end } = req.query;
    const transactions = await plaidService.getCachedTransactions(start, end);
    
    if (transactions.message === "Unauthorized") {
      return res.status(403).json({ message: 'forbidden' });
    }

    res.json(transactions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
}

const reconcile = async (req, res) => {
  try {
    const user = req.user

    if (user.role != 'admin'){
      res.status(403).json({ message: 'forbidden' });
    }

    // do stuff in service


  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
}


const getAllTrx  = async (req, res) => {
  try {
    const transactions = await getAll(req.user);
    
    if (transactions.message === "Unauthorized") {
      return res.status(403).json({ message: 'Forbidden' });
    }

    res.json(transactions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
}

const addPlaidTransactions = async (req, res) => {
  try {
    const transactions = Array.isArray(req.body) ? req.body : [req.body];
    
    if (transactions.length === 0) {
      return res.status(400).json({ message: 'No transaction data provided' });
    }

    const results = [];
    const errors = [];

    // Process transactions sequentially to maintain accurate counts
    for (const transactionData of transactions) {
      try {
        const result = await addTransaction(transactionData);
        results.push(result);
      } catch (error) {
        errors.push({
          data: transactionData,
          error: error.message
        });
      }
    }

    // Return appropriate response
    if (errors.length > 0) {
      return res.status(207).json({ // 207 Multi-Status
        message: `Processed with some errors`,
        successCount: results.length,
        errorCount: errors.length,
        successful: results,
        errors: errors
      });
    }

    if (results.length === 1) {
      res.status(201).json(results[0]);
    } else {
      res.status(201).json({
        message: `Processed ${results.length} transactions`,
        count: results.length,
        transactions: results
      });
    }
  } catch (error) {
    console.error('Transaction processing error:', error);
    res.status(400).json({ 
      message: error.message || 'Error processing transaction data' 
    });
  }
};

// const addPlaidTransactions = async (req, res) => {
//   try {
//     // Check if the request contains a single transaction or an array
//     const transactions = Array.isArray(req.body) ? req.body : [req.body];
//     
//     // Validate we have at least one transaction
//     if (transactions.length === 0) {
//       return res.status(400).json({ message: 'No transaction data provided' });
//     }

//     // Process all transactions in parallel
//     const transactionPromises = transactions.map(transactionData => 
//       addTransaction({
//         ...transactionData,
//         // Add any additional fields you need here
//       })
//     );

//     // Wait for all transactions to be processed
//     const results = await Promise.all(transactionPromises);
//     
//     // Return appropriate response based on number of transactions
//     if (results.length === 1) {
//       res.status(201).json(results[0]);
//     } else {
//       res.status(201).json({
//         message: `Successfully processed ${results.length} transactions`,
//         count: results.length,
//         transactions: results
//       });
//     }
//   } catch (error) {
//     console.error('Transaction processing error:', error);
//     
//     // More detailed error handling
//     if (error.name === 'ValidationError') {
//       res.status(422).json({ 
//         message: 'Validation failed',
//         errors: error.errors 
//       });
//     } else {
//       res.status(400).json({ 
//         message: error.message || 'Error processing transaction data' 
//       });
//     }
//   }
// };



module.exports = {
  getSandboxToken,
  createLinkToken,
  exchangePublicToken,
  reconcile,
  getLiveTransactions,
  getCachedTransactions,
  getAllTrx
}
