module.exports = {
    createClub: async (data) => ({ id: "123", ...data }),
    getAllClubs: async () => [{ id: "123", name: "Placeholder Club" }],
    getClubById: async (id) => ({ id, name: "Placeholder Club" }),
    updateClub: async (id, data) => ({ id, ...data }),
    deleteClub: async (id) => ({ message: "Club deleted successfully" }),
  };
  