/* APP
 * MAIN EXPRESS APP, highest, most abstract level of business logic
 * */

const cors = require('cors');
const express = require('express');
const {connectMemoryDB} = require('./services/db')

const app = express();

//routers
const reimbursementRouter = require('./api/requests/reimbursement.routes')
const paymentRouter = require('./api/requests/payment.routes')
const plaidRouter = require('./api/requests/plaid.routes')
const accountsRouter = require('./api/account-management/accounts.routes')


// connectDB();
connectMemoryDB();

// Middleware (if needed)
app.use(cors());
app.use(express.json());

// Use the requests router for the /api/requests.routes path
app.use('/api/requests/payment', paymentRouter);
app.use('/api/requests/reimbursement', reimbursementRouter);
app.use('/api/plaid', plaidRouter);

app.use('/api/accounts', accountsRouter);

// Base route
app.get('/', (req, res) => {
    res.send('Welcome to the API!');
});

// Export the app
module.exports = app
