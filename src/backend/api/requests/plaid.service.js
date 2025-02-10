
require('dotenv').config({ path: require('path').resolve(__dirname, '../../.env') });

const { Configuration, PlaidApi, PlaidEnvironments } = require('plaid');

const reimbursementService = require('./reimbursement.service')
const paymentService = require('./payment.service');

class PlaidService {
  constructor() {
    // Initialize Plaid client
    const configuration = new Configuration({
      basePath: PlaidEnvironments[process.env.PLAID_ENV],
      baseOptions: {
        headers: {
          'PLAID-CLIENT-ID': process.env.PLAID_CLIENT_ID,
          'PLAID-SECRET': process.env.PLAID_SECRET,
        },
      },
    });
    this.client = new PlaidApi(configuration);
  }

  async createLinkToken(userId) {
    try {
      const response = await this.client.linkTokenCreate({
        user: { client_user_id: userId },
        client_name: 'MES',
        products: ['transactions'],
        country_codes: ['US'],
        language: 'en',
      });
      return response.data.link_token;
    } catch (error) {
      console.error('Error creating Link Token:', error);
      throw error;
    }
  }

  async exchangePublicToken(publicToken) {
    try {
      const response = await this.client.itemPublicTokenExchange({ public_token: publicToken });
      return response.data;
    } catch (error) {
      console.error('Error exchanging public token:', error);
      throw error;
    }
  }

  async getTransactions(accessToken, startDate, endDate) {
    try {
      const response = await this.client.transactionsGet({
        access_token: accessToken,
        start_date: startDate,
        end_date: endDate,
      });
      return response.data.transactions;
    } catch (error) {
      console.error('Error fetching transactions:', error);
      throw error;
    }
  }
}
//  -------------------------------------------------------

// const getAllRequests = async (user) => {
//   try {
//     const [reimbursements, payments] = await Promise.all([
//       reimbursementService.getReimbursements(user),
//       paymentService.getPayments(user),
//     ]);
//     return {reimbursements, payments} 
//   } catch (error) {
//     console.error('Error fetching all requests:', error);
//     throw error;
//   }
// }

// const getAllPlaidTransactions = async (user) => {
//   // by item_id / access_token 
//   try {
//     const tokens = user.plaid
//     var res = []
//     tokens.forEach((item_id, access_token) => {
//       
//     });
//   } catch (error) {
//     console.log('Error fetching all plaid transactions', error) 
//     throw error;
//   }
// }

// //returns requests and transactions not yet reconciled from current data
// const filterRequestsAndTransactions = async (reqs, trxs) => {

// }

// const reconcileRequestsAndTransactions = async (reqs, trxs) => {
//   
//   //for each request
//   //
//   // date
//   // amount +- $1
//   // 

// }




// //  -------------------------------------------------------
// /** 
//  * DATA RECONCILIATION FLOW
//  * 1. API fetches reimbursement requests from the database
//  * 2. API fetches transactions from Plaid
//  * 3. This function reconciles both datasets based on date & amount
//  * 4. The database gets updated accordingly
//  * 5. Frontend gets notified to refresh
//  */

// const reconcileData = (plaidData, reqsData) => {

//     const groupByDateAndAmount = (data) => {
//         return data.reduce((acc, item) => {
//             const key = `${item.date}-${item.amount}`;
//             if (!acc[key]) {
//                 acc[key] = [];
//             }
//             acc[key].push(item);
//             return acc;
//         }, {});
//     };

//     const plaidGrouped = groupByDateAndAmount(plaidData);
//     const reqsGrouped = groupByDateAndAmount(reqsData);

//     // Reconcile
//     Object.keys(reqsGrouped).forEach((key) => {

//         if (plaidGrouped[key] && plaidGrouped[key].length >= reqsGrouped[key].length) {
//             // Mark all requests in this group as reconciled
//             reqsGrouped[key].forEach((req) => {
//                 req.status = 'Reconciled'; // Generic reconciliation marker
//                 req.plaid_transaction = '??'
//             });

//             // Optionally, remove used transactions if one-to-one is needed later
//             // plaidGrouped[key].splice(0, reqsGrouped[key].length);

//         } else {
//             // Mark as unreconciled if not enough transactions
//             reqsGrouped[key].forEach((req) => {
//                 req.plaid_transaction = null; // Not reconciled
//             });
//         }
//     });

//     // Flatten the reconciled request groups back into an array
//     return Object.values(reqsGrouped).flat();
// } 


const reconcileRequestsAndTransactions = async (user) => {
  try {
    // Fetch all non-reconciled reimbursement and payment requests
    const { reimbursements, payments } = await getAllRequests(user);
    
    // Fetch all Plaid transactions for user's linked accounts
    const transactions = await getAllPlaidTransactions(user);
    
    // Filter out already reconciled requests and transactions
    const unreconciledRequests = [...reimbursements, ...payments].filter(
      (req) => !req.plaid.isReconciled
    );
    const unreconciledTransactions = transactions.filter(
      (trx) => !trx.reconciled
    );
    
    console.log(`Found ${unreconciledRequests.length} unreconciled requests`);
    console.log(`Found ${unreconciledTransactions.length} unreconciled transactions`);
    
    // Attempt reconciliation
    const reconciled = matchRequestsToTransactions(unreconciledRequests, unreconciledTransactions);
    
    // Save updates to the database
    for (const { request, transaction } of reconciled) {
      request.plaid.transactionId = transaction.transaction_id;
      request.plaid.accountId = transaction.account_id;
      request.plaid.transactionAmount = transaction.amount;
      request.plaid.isReconciled = true;
      await request.save();
    }
    
    console.log(`Reconciled ${reconciled.length} transactions successfully.`);
    return reconciled;
  } catch (error) {
    console.error("Error during reconciliation:", error);
    throw error;
  }
};

const matchRequestsToTransactions = (requests, transactions) => {
  const reconciled = [];
  const tolerance = 1.0; // Allow for small amount discrepancies

  for (const request of requests) {
    const matchIndex = transactions.findIndex((trx) =>
      Math.abs(trx.amount - request.totalAmount || request.amount) <= tolerance &&
      new Date(trx.date).toDateString() === new Date(request.createdAt).toDateString()
    );

    if (matchIndex !== -1) {
      reconciled.push({ request, transaction: transactions[matchIndex] });
      transactions.splice(matchIndex, 1); // Remove matched transaction
    }
  }
  return reconciled;
};

const getAllRequests = async (user) => {
  try {
    const [reimbursements, payments] = await Promise.all([
      reimbursementService.getReimbursements(user),
      paymentService.getPayments(user),
    ]);
    return { reimbursements, payments };
  } catch (error) {
    console.error("Error fetching all requests:", error);
    throw error;
  }
};

const getAllPlaidTransactions = async (user) => {
  try {
    const tokens = user.plaid;
    let allTransactions = [];

    for (const { item_id, access_token } of tokens) {
      const transactions = await plaidService.fetchTransactions(access_token);
      allTransactions = allTransactions.concat(transactions);
    }
    return allTransactions;
  } catch (error) {
    console.error("Error fetching all Plaid transactions:", error);
    throw error;
  }
};

module.exports = {
  PlaidService,
  reconcileRequestsAndTransactions
}
