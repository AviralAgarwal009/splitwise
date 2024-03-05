'use strict';

const mongoose = require('mongoose');
const ExpenseSchema = require('./../schemas/expense_schema');


ExpenseSchema.statics.createExpense = async function (params, usersContributions) {

    let expense = new Expense({
        amount: params.amount,
        category: params.category,
        description: params.description,
        participants: usersContributions
    })

    if (params.group_id) {
        expense.group_id = params.group_id;
    }

    return await expense.save();

}

ExpenseSchema.statics.getExpenseHistory = async function (params) {
    let query = {
        createdAt: { $gte: new Date(params.start_time), $lte: new Date(params.end_time) },
        "participants.user_id": params.user_id
    }

    const expensesByCategory = await Expense.aggregate([
        { $match: query },
        {
            $unwind: "$participants"
        },
        {
            $match: { "participants.user_id": params.user_id }
        },
        {
            $group: {
                _id: "$category",
                totalAmount: { $sum: "$participants.amount" }
            }
        }
    ]);

    return expensesByCategory;
}

ExpenseSchema.statics.getGroupExpenseHistory = async function (group_id) {

    let query = {
        group_id: group_id
    }

    let results = await Expense.find(query);

    return results;
}



let Expense = mongoose.model('Expense', ExpenseSchema);
module.exports = Expense;
