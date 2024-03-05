'use strict';

const User = require('./../../models/user');
const Joi = require('joi');
const Expense = require('./../../models/expense');

const participantSchema = Joi.object({
    contribution: Joi.number().positive().required()
}).unknown(true);


class AbsoulteExpenseService {
    constructor(participants, amount, paid_by, options) {
        this.participants = participants;
        this.amount = amount;
        this.paid_by = paid_by;
        this.category = options.category;
        this.description = options.description;
        this.group_id = options.group_id;

        this.usersContributions = {};
    }

    async validateBreakup() {
        let currentTotal = 0;
        for (let participant of this.participants) {
            let user = await User.findOne({ user_id: participant.user_id });

            if (!user) throw new Error(`User ${participant.user_id} does not exist`);
            let validation = participantSchema.validate(participant);
            if (validation.error) {
                throw new Error(validation.error);
            }

            currentTotal += participant.contribution;

        }
        if (currentTotal !== this.amount) {
            throw new Error('Invalid contribution');
        }
    }

    async createExpense() {
        let expenseParams = {
            amount: this.amount,
            category: this.category,
            description: this.description,
        }
        if (this.group_id) {
            expenseParams.group_id = this.group_id;
        }
        let formattedUserContributions = this.getUsersContribution();
        let expense = await Expense.createExpense(expenseParams, formattedUserContributions);
        return expense;
    }

    getUsersContribution() {
        this.usersContributions = {};
        for (let participant of this.participants) {
            let currentContribution = Number(participant.contribution);
            this.usersContributions[participant.user_id] = (this.usersContributions[participant.user_id] || 0) + currentContribution;
        }

        let formattedUserContributions = [];
        for (let user_id in this.usersContributions) {
            let currentUserContribution = {
                user_id: user_id,
                amount: this.usersContributions[user_id]
            };

            formattedUserContributions.push(currentUserContribution);
        }

        return formattedUserContributions;

    }

    getFinalBalances() {

        let finalBalances = {};
        finalBalances[this.paid_by] = (finalBalances[this.paid_by] || 0) - this.amount;

        for (let participant of this.participants) {
            let currentContribution = Number(participant.contribution);
            finalBalances[participant.user_id] = (finalBalances[participant.user_id] || 0) + currentContribution;
        }

        let formattedUserContributions = [];
        for (let user_id in finalBalances) {
            let currentUserContribution = {
                user_id: user_id,
                amount: finalBalances[user_id]
            };

            formattedUserContributions.push(currentUserContribution);
        }

        return formattedUserContributions;

    }


}

module.exports = AbsoulteExpenseService;