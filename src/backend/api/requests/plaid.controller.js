
const {reconcileRequestsAndTransactions, PlaidService} = require('./plaid.service')


const plaidService = new PlaidService()
const userService = require('../users/users.service');


/* PLAID SERVICE LOGIC
 *
 * provides a link token for UI auth
 * accepts and exchanges a public token
 * returns a access token
 * */
const getSandboxToken = async (req,res) => {
  try {
    const response = await plaidService.client.sandboxPublicTokenCreate({
      institution_id: 'ins_109508', // Example institution ID
      initial_products: ['transactions'], // Products to enable
    })
    res.status(200).json(response.data.public_token)
  } catch (error) {
    console.log('Error', error.data) 
res.status(500).json(error)
  }
}

const createLinkToken = async (req, res) => {
  try {
    const userId = req.user._id; 
    const linkToken = await plaidService.createLinkToken(userId);
    res.status(200).json({ linkToken });
  } catch (error) {
    console.error('Error creating Link Token:', error);
    res.status(500).json({ error: 'Failed to create Link Token' });
  }
};

const exchangePublicToken = async (req, res) => {
  try {
    const userId = req.user._id 
    const { publicToken } = req.body;
    const { access_token, item_id } = await plaidService.exchangePublicToken(publicToken);
  
    //once access_token is recieved, store this bad boy in the users database by PUT request
    const newUser = await userService.updateUser(userId, { $push: { plaid: { access_token, item_id }}}) 
    console.log(newUser)

    res.status(200).json({ access_token, item_id });
  } catch (error) {
    console.error('Error exchanging Public Token:', error);
    res.status(500).json({ error: 'Failed to exchange Public Token' });
  }
};

const getTransactions = async (req, res) => {
  try {
    const { start, end, accessToken } = req.query;
    const transactions = await plaidService.getTransactions(accessToken, start, end);
    res.status(200).json(transactions);
  } catch (error) {
    console.error('Error fetching transactions:', error);
    res.status(500).json({ error: 'Failed to fetch transactions' });
  }
};

const reconcileRT = async (req, res) => {}



module.exports = {
  getSandboxToken,
  createLinkToken,
  getTransactions,
  exchangePublicToken,
  reconcileRequestsAndTransactions
}
