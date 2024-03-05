'use strict';

const express = require('express');
const router = express.Router();
const SimplifyController = require('./simplify_controller');

router.get('/transactions', SimplifyController.getUserTransactions);

router.get('/all/transactions', SimplifyController.getAllTransactions);


module.exports = router;