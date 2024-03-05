'use strict';

const express = require('express');
const router = express.Router();
const ExpenseController = require('./expense_controller');

router.post('/add/expense', ExpenseController.createNewExpense);

router.get('/user/expenses',ExpenseController.getUserExpenses)

module.exports = router;