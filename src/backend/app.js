/* APP
 * MAIN EXPRESS APP, highest, most abstract level of business logic
 * */
require('dotenv').config();
const cors = require('cors');
const express = require('express');
const mongoose = require('mongoose')
const connectAtlasDB = require('./services/db')

const { addUserData, fakeAuth } = require('./services/testAuth') //test middleware function that intercepts a http request and appends some req.user info

const app = express();

//routers
const reimbursementRouter = require('./api/requests/reimbursement.routes')
const paymentRouter = require('./api/requests/payment.routes')
const requestRouter = require('./api/requests/request.routes')
const plaidRouter = require('./api/requests/plaid.routes')
const accountsRouter = require('./api/account-management/accounts.routes')
const userRouter = require('./api/users/users.routes')
const clubRouter = require('./api/clubs/clubs.routes')
const fileRouter = require('./api/files/files.routes')


connectAtlasDB();

// Middleware (if needed)
app.use(cors());
app.use(express.json());

// Base route
app.get('/', (req, res) => {
    res.send('Welcome to the API!');
});

// Health check
app.get('/health', async (req, res) => {
    try {
      await mongoose.connection.db.admin().ping();
      res.status(200).json({ status: 'OK', database: 'Connected' });
    } catch (err) {
      res.status(500).json({ status: 'Error', error: err.message });
    }
  });

// Use the requests router for the /api/requests.routes path
app.use('/api/requests/', fakeAuth, requestRouter);
app.use('/api/requests/payment', fakeAuth, paymentRouter);
app.use('/api/requests/reimbursement', fakeAuth, reimbursementRouter);
app.use('/api/plaid', fakeAuth, plaidRouter);
app.use('/api/accounts', fakeAuth, accountsRouter);
app.use('/api/users', fakeAuth, userRouter);
app.use('/api/clubs', fakeAuth, clubRouter)
app.use('/api/files', fakeAuth, fileRouter)

// Export the app
module.exports = app