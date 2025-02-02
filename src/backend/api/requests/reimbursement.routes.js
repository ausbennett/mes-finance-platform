const express = require('express')
const router = express.Router()

const reimbursementController = require('./reimbursement.controller')


// RELATIVE TO `/api/requests/reimbursement/`

// will use an authService middleware for JWT Role Based Access
router.get('/', reimbursementController.getReimbursements)

router.post('/', reimbursementController.createReimbursement)

router.put('/:id', reimbursementController.editReimbursement)


