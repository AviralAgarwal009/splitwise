'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const expenseConstants = require('./../constants/expense_constants');

const ParticipantsSchema = new Schema({
    user_id: { type: Number, ref: 'User' },
    amount: { type: Number }
});

const ExpenseSchema = new Schema({

    amount: { type: Number },
    category: { type: String, enum: Object.values(expenseConstants.category) },
    description: { type: String },
    participants: { type: [ParticipantsSchema] },
    group_id: { type: Number, ref: 'Group' }

}, { timestamps: true });



module.exports = ExpenseSchema;