require('dotenv').config();
const express = require('express');
const { Configuration, PlaidApi, PlaidEnvironments } = require('plaid');

const app = express();
const PORT = 3000;

app.use(express.json());

// Configure Plaid
const config = new Configuration({
    basePath: PlaidEnvironments[process.env.PLAID_ENV],
    baseOptions: {
        headers: {
            'PLAID-CLIENT-ID': process.env.PLAID_CLIENT_ID,
            'PLAID-SECRET': process.env.PLAID_SECRET,
        },
    },
});

const client = new PlaidApi(config);

/*
 * Because of how plaid works, you need to get a public token first
 * Then use this token to get an access token
 * FINALLY
 * You're able to use this access token to query finances (just transactions in our case)
 * */


const fetchTransactionsWithRetry = async (accessToken, retries = 5, delay = 5000) => {
    for (let i = 0; i < retries; i++) {
        try {
            const response = await client.transactionsGet({
                access_token: accessToken,
                start_date: '2023-01-01',
                end_date: '2025-01-15',
            });

            return response.data.transactions; // Transactions are ready
        } catch (error) {
            if (error.response?.data?.error_code === 'PRODUCT_NOT_READY') {
                console.log(`Retrying... (${i + 1}/${retries})`);
                await new Promise((resolve) => setTimeout(resolve, delay)); // Wait before retrying
            } else {
                throw error; // Other errors should not be retried
            }
        }
    }

    throw new Error('Transactions product not ready after retries');
};


app.get('/api/sandbox/transactions', async (req, res) => {
    try {
        const publicTokenResponse = await client.sandboxPublicTokenCreate({
            institution_id: 'ins_109508',
            initial_products: ['transactions'],
        });

        const publicToken = publicTokenResponse.data.public_token;

        const accessTokenResponse = await client.itemPublicTokenExchange({
            public_token: publicToken,
        });

        const accessToken = accessTokenResponse.data.access_token;

        // Fetch transactions with retry logic
        const transactions = await fetchTransactionsWithRetry(accessToken);

        res.json(transactions);
    } catch (error) {
        console.error('Error fetching sandbox transactions:', error.response?.data || error.message);
        res.status(500).json({ error: error.response?.data || 'Failed to fetch transactions' });
    }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
