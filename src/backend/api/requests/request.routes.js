const express = require('express');
const router = express.Router()
const { fakeAuth } = require('../../services/testAuth');
const { addUserData } = require('../../services/testAuth');

const requestController = require('./request.controller.js')

//get both reimbursements & payements
router.get('/', requestController.getAllRequests)


router.put('/:id', requestController.updateRequestStatus);

router.get('/:id', requestController.getRequestById);

module.exports = router;
