const express = require('express');
const router = express.Router()

const requestController = require('./request.controller.js')

//get both reimbursements & payements
router.get('/', requestController.getAllRequests)


module.exports = router;
