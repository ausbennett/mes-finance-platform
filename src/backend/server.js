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

app.post('/api/sandbox/create-public-token', async (req, res) => {
    try {
        const response = await client.sandboxPublicTokenCreate({
            institution_id: 'ins_109508', // Sample institution ID
            initial_products: ['transactions'], // Specify the products you need
        });

        const publicToken = response.data.public_token;
        res.json({ public_token: publicToken });
    } catch (error) {
        console.error('Error creating sandbox public token:', error);
        res.status(500).json({ error: 'Failed to create sandbox public token' });
    }
});

app.post('/api/exchange-public-token', async (req, res) => {
    const { public_token } = req.body;

    try {
        const response = await client.itemPublicTokenExchange({ public_token });
        const accessToken = response.data.access_token;
        res.json({ accessToken });
    } catch (error) {
        console.error('Error exchanging public token:', error);
        res.status(500).json({ error: 'Failed to exchange public token' });
    }
});

app.get('/api/transactions', async (req, res) => {
    const { accessToken } = req.query; // Pass the access token in the query

    try {
        const response = await client.transactionsGet({
            access_token: accessToken,
            start_date: '2023-01-01',
            end_date: '2025-01-15',
        });

        res.json(response.data.transactions);
    } catch (error) {
        console.error('Error fetching transactions:', error);
        res.status(500).json({ error: 'Failed to fetch transactions' });
    }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
