
const Payment = require('../../models/payment.model')

const getPayments = async (user) => {
  try{

    const { role, id, clubId} = user;

    let payments;
    if (role === "admin") {
        // Admins can see everything
        payments = await Payment.find({});
    } else if (role === "club_admin") {
        // Club admins can see payments for their club
        payments = await Payment.find({ clubId: clubId });
    } else if (role === "student") {
        // Students can only see their own requests
        payments = await Payment.find({ studentId: id });
    } else {
        return { message: "Unauthorized" };
    }
    return payments

  } catch (error){
    console.error(error)
    return { message: error} 
  }
}
// POST
const createPayment = async (data) => {
  try {
    const payment = new Payment(data);
    await payment.save();
    return payment;
  } catch (error) {
    console.error(error);
    return { message: error.message };
  }
};

// PUT
const editPayment = async (id, data) => {
  try {
    const payment = await Payment.findByIdAndUpdate(id, data, { new: true });
    return payment;
  } catch (error) {
    console.error(error);
    return { message: error.message };
  }
};

module.exports = {
  getPayments,
  createPayment,
  editPayment,
};
