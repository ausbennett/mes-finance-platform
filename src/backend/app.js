/* APP
 * MAIN EXPRESS APP, highest, most abstract level of business logic
 * */

const express = require('express');
const {connectMemoryDB} = require('./services/db')

const app = express();

//routers
const requestsRouter = require('./api/requests/requests.routes');
const accountsRouter = require('./api/account-management/accounts.routes')

// Middleware (if needed)
app.use(express.json());

// connectDB();
connectMemoryDB();

// Use the requests router for the /api/requests.routes path
app.use('/api/requests', requestsRouter);
app.use('/api/accounts', accountsRouter);

// Base route
app.get('/', (req, res) => {
    res.send('Welcome to the API!');
});

// Export the app
module.exports = app
