/* REQUESTS CONTROLLER
 * This is where all the logic for endpoints, data processing etc, 
 * The router uses this and passes data into the functions here
 * */


exports.getAllRequests = (req, res) => {
    const requests = { message: "requests"}
    res.json(requests);
};

exports.createRequest = (req, res) => {
    const newRequest = req.body;
    // const createdRequest = requestsService.createRequest(newRequest);
    res.status(201).json({ message: "ur mom"});
};

exports.getRequestById = (req, res) => {
    const { id } = req.params;
    // const request = requestsService.getRequestById(id);
    const request = { message: "requests id: " + id};
    if (request) {
        res.json(request);
    } else {
        res.status(404).json({ message: 'Request not found' });
    }
};
