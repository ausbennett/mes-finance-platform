require('dotenv').config();
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
        client_name: 'Your App Name',
        products: ['transactions'],
        country_codes: ['US'],
        language: 'en',
        redirect_uri: 'https://your-redirect-url.com',
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

module.exports = new PlaidService();

