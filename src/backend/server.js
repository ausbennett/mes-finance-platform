/* SERVER
 * Logic that actually serves our backend and acts as an entry point into our app
 * */


const app = require('./app'); // Import the Express app from app.js

const PORT = process.env.PORT || 3001;

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
