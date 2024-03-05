'use strict';

const Joi = require('joi');
const Expense = require('./../../models/expense');
const User = require('./../../models/user');
const expenseConstants = require('./../../constants/expense_constants');
const AbsoulteExpenseService = require('../../services/expense_service/AbsoluteExpenseService');
const FractionalExpenseService = require('../../services/expense_service/FractionalExpenseService');
const PercenatgeExpenseService = require('../../services/expense_service/PercentageExpenseService');
const Group = require('./../../models/group');


const expenseBasicSchema = Joi.object({
    type: Joi.string()
        .valid(...Object.values(expenseConstants.type))
        .required(),
    category: Joi.string()
        .valid(...Object.values(expenseConstants.category))
        .required(),
    amount: Joi.number().positive().required(),
    paid_by: Joi.number().required()

}).unknown(true);




class ExpenseController {

    static async createNewExpense(req, res, next) {

        let validation = expenseBasicSchema.validate(req.body);

        if (validation.error) {
            return next(new Error(validation.error.message));
        }

        //check paid by is valid user or not
        let paidByUser = await User.findOne({ user_id: req.body.paid_by });
        if (!paidByUser) {
            return next(new Error(`User ${req.body.paid_by} does not exist`));
        }

        let group_id = req.body.group_id;
        if (group_id) {
            let group = await Group.findOne({ group_id: group_id });
            if (!group) return next(new Error("Invalid group id"));
        }

        let expenseService = null;
        switch (req.body.type) {
            case expenseConstants.type.absolute:
                expenseService = new AbsoulteExpenseService(req.body.participants, req.body.amount, req.body.paid_by, { category: req.body.category, description: req.body.description, group_id: group_id });
                break;
            case expenseConstants.type.fraction:
                expenseService = new FractionalExpenseService(req.body.participants, req.body.amount, req.body.paid_by, { category: req.body.category, description: req.body.description, group_id: group_id });
                break;
            case expenseConstants.type.percentage:
                expenseService = new PercenatgeExpenseService(req.body.participants, req.body.amount, req.body.paid_by, { category: req.body.category, description: req.body.description, group_id: group_id });
                break;
        }

        try {
            await expenseService.validateBreakup();

            let expense = await expenseService.createExpense();

            let finalBalances = expenseService.getFinalBalances();
            await User.updateUserBalances(finalBalances); //can update using kafka for separation from api call

            req.response = {
                expense_id: expense._id,
                amount: expense.amount,
                category: expense.category,
                participants: expense.participants,
                group_id: expense.group_id
            }

            next();

        } catch (err) {
            next(err);
            return;
        }


    }

    static async getUserExpenses(req, res, next) {

        let start_time = req.body.start_time;
        let end_time = req.body.end_time;
        let user_id = req.body.user_id;
        try {

            let user = await User.findOne({ user_id: user_id });
            if (!user) throw new Error(`User ${user_id} does not exist`);
            let expenses = await Expense.getExpenseHistory({
                start_time, end_time, user_id
            });

            req.response = expenses;
            next();

        } catch (err) {

            return next(err);
        }

    }

};

module.exports = ExpenseController;



