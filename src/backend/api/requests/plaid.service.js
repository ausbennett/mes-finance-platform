
require('dotenv').config({ path: require('path').resolve(__dirname, '../../.env') });
const { Configuration, PlaidApi, PlaidEnvironments } = require('plaid');

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

/** 
 * DATA RECONCILIATION FLOW
 * 1. API fetches reimbursement requests from the database
 * 2. API fetches transactions from Plaid
 * 3. This function reconciles both datasets based on date & amount
 * 4. The database gets updated accordingly
 * 5. Frontend gets notified to refresh
 */

const reconcileData = (plaidData, reqsData) => {

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

module.exports = {
  PlaidService,
  reconcileData
}

