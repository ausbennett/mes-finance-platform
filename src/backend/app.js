/* APP
 * MAIN EXPRESS APP, highest, most abstract level of business logic
 * */

const cors = require('cors');
const express = require('express');
const {connectMemoryDB} = require('./services/db')

const { addUserData, fakeAuth } = require('./services/testAuth') //test middleware function that intercepts a http request and appends some req.user info

const app = express();

//routers
const reimbursementRouter = require('./api/requests/reimbursement.routes')
const paymentRouter = require('./api/requests/payment.routes')
const plaidRouter = require('./api/requests/plaid.routes')
const accountsRouter = require('./api/account-management/accounts.routes')
const userRouter = require('./api/users/users.routes')


// connectDB();
connectMemoryDB();

// Middleware (if needed)
app.use(cors());
app.use(express.json());

// Use the requests router for the /api/requests.routes path
app.use('/api/requests/payment', fakeAuth, paymentRouter);
app.use('/api/requests/reimbursement', fakeAuth, reimbursementRouter);
app.use('/api/plaid', plaidRouter);
app.use('/api/accounts', accountsRouter);
app.use('/api/users', userRouter);

// Base route
app.get('/', (req, res) => {
    res.send('Welcome to the API!');
});

// Export the app
module.exports = app
