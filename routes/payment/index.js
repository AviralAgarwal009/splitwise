'use strict';

const express = require('express');
const router = express.Router();
const PaymentController = require('./payment_controller');

router.post('/add/payment', PaymentController.addPayment);


module.exports = router;