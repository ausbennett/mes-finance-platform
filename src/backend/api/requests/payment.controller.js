
const paymentService = require('./payment.service')


const getPayments = async (req, res) => {
  const user = req.user; 
  const payments = await paymentService.getPayments(user);
  return res.status(payments.message ? 400 : 200).json(payments);
};

// POST - Creates a new payment
const createPayment = async (req, res) => {
  const paymentData = {
    requestor: req.user._id, 
    ...req.body
  }; 
  const payment = await paymentService.createPayment(paymentData);
  return res.status(payment.message ? 400 : 201).json(payment);
};

const editPayment = async (req, res) => {
  const { id } = req.params; 
  const paymentData = req.body;
  const payment = await paymentService.editPayment(id, paymentData);
  return res.status(payment.message ? 400 : 200).json(payment);
};

module.exports = {
  getPayments,
  createPayment,
  editPayment,
};
