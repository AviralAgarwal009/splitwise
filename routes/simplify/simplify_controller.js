'use strict';

const SimplificationService = require('./../../services/simplification_service/simplification_service');
const User = require('./../../models/user');

class SimplifyController {
    constructor() {

    }

    static async getUserTransactions(req, res, next) {

        let user_id = req.query.user_id;
        let user = await User.findOne({ user_id: user_id });
        if (!user) {
            return next(new Error(`User ${user_id} does not exist`));
        }
        try {
            let simplificationService = new SimplificationService();
            await simplificationService.loadBalancesAndSimplify();
            let userTransactions = await simplificationService.getUserTransactions(user_id);
            if (!userTransactions || userTransactions.length == 0) {
                req.response = {
                    message: "No transactions needed"
                }
            } else {
                req.response = userTransactions;
            }
            next();
        } catch (err) {
            return next(err);
        }

    }

    static async getAllTransactions(req, res, next) {
        try {
            let simplificationService = new SimplificationService();
            await simplificationService.loadBalancesAndSimplify();
            let transactions = simplificationService.transactions;

            if (!transactions || Object.keys(transactions).length == 0) {
                req.response = {
                    message: "No transactions needed"
                }
            } else {
                req.response = transactions;
            }
            next();

        } catch (err) {
            return next(err);
        }
    }


}

module.exports = SimplifyController;



