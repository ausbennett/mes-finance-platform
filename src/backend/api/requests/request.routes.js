const express = require('express');
const router = express.Router()
const requestController = require('./request.controller.js')

//get both reimbursements & payements
router.get('/', requestController.getAllRequests)
router.get('/by-date', requestController.getRequestsByDateRange)
router.put('/id/:id', requestController.updateRequestStatus);
router.get('/id/:id', requestController.getRequestById);

module.exports = router;
