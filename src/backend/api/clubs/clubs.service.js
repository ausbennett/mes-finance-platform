const Club = require("../../models/club.model");

const getAllClubs = async () => {
   return await Club.find({});
};

const getClubById = async (id) => {
   return await Club.findById(id);
};

const createClub = async (data) => {
   const club = new Club(data);
   return await club.save();
};

const updateClub = async (id, data) => {
   return await Club.findByIdAndUpdate(id, data, { new: true });
};

const deleteClub = async (id) => {
   return await Club.findByIdAndDelete(id);
};

module.exports = {
   getAllClubs,
   getClubById,
   createClub,
   updateClub,
   deleteClub,
};
