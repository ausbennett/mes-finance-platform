
const paymentService = require('./payment.service')


const getPayments = async (req, res) => {
  const user = req.user; // assuming user info is added in middleware (e.g., from JWT)
  const payments = await paymentService.getPayments(user);
  if (payments.message) {
    return res.status(400).json(payments); // error message
  }
  return res.status(200).json(payments); // success
};

// POST - Creates a new payment
const createPayment = async (req, res) => {
  const paymentData = req.body; // assuming the body contains payment data
  const payment = await paymentService.createPayment(paymentData);
  if (payment.message) {
    return res.status(400).json(payment); 
  }
  return res.status(201).json(payment); 
};

const editPayment = async (req, res) => {
  const { id } = req.params; // ID of the payment to update
  const paymentData = req.body; // assuming the body contains the updated data
  const payment = await paymentService.editPayment(id, paymentData);
  if (payment.message) {
    return res.status(400).json(payment); 
  }
  return res.status(200).json(payment); 
};

module.exports = {
  getPayments,
  createPayment,
  editPayment,
};
