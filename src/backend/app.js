/* APP
 * MAIN EXPRESS APP, highest, most abstract level of business logic
 * */

const express = require('express');
const app = express();

//routers
const requestsRouter = require('./api/requests/requests.routes');

// Middleware (if needed)
app.use(express.json());

// Use the requests router for the /api/requests.routes path
app.use('/api/requests', requestsRouter);

// Base route
app.get('/', (req, res) => {
    res.send('Welcome to the API!');
});

// Export the app
module.exports = app
