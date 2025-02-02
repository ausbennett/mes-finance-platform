const express = require('express')
const router = express.Router()

const paymentController = require('./payment.controller')


// RELATIVE TO `/api/requests/payment/`

// will use an authService middleware for JWT Role Based Access
router.get('/', paymentController.getPayments)

router.post('/', paymentController.createPayment)

router.put('/:id', paymentController.editPayment)

module.exports = router
