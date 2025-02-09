
const {reconcileData, PlaidService} = require('./plaid.service')


const plaidService = new PlaidService()
const userService = require('../users/users.service');


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
    const { accessToken, startDate, endDate } = req.body;
    const transactions = await plaidService.getTransactions(accessToken, startDate, endDate);
    res.status(200).json(transactions);
  } catch (error) {
    console.error('Error fetching transactions:', error);
    res.status(500).json({ error: 'Failed to fetch transactions' });
  }
};




module.exports = {
  getSandboxToken,
  createLinkToken,
  getTransactions,
  exchangePublicToken
}
