
const Reimbursement = require('../models/reimbursement.model');

// GET
// FOR ADMINS
// FOR CLUBS
// FOR STUDENTS
//
// https://chatgpt.com/share/679ff292-a574-8011-8e25-9ec54d6b4219

const getReimbursements = async (user) => {
  try{

    const { role, id, clubId} = user;

    let reimbursements;
    if (role === "admin") {
        // Admins can see everything
        reimbursements = await Reimbursement.find({});
    } else if (role === "club_admin") {
        // Club admins can see reimbursements for their club
        reimbursements = await Reimbursement.find({ clubId: clubId });
    } else if (role === "student") {
        // Students can only see their own requests
        reimbursements = await Reimbursement.find({ studentId: id });
    } else {
        return { message: "Unauthorized" };
    }
    return reimbursements

  } catch (error){
    console.error(error)
    return { message: error} 
  }
}
// POST
const createReimbursement = async (data) => {
  try {
    const reimbursement = new Reimbursement(data);
    await reimbursement.save();
    return reimbursement;
  } catch (error) {
    console.error(error);
    return { message: error.message };
  }
};

// PUT
const editReimbursement = async (id, data) => {
  try {
    const reimbursement = await Reimbursement.findByIdAndUpdate(id, data, { new: true });
    return reimbursement;
  } catch (error) {
    console.error(error);
    return { message: error.message };
  }
};

module.exports = {
  getReimbursements,
  createReimbursement,
  editReimbursement,
};

 
