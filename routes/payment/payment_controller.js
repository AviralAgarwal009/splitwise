'use strict';
const Joi = require('joi');
const User = require('./../../models/user');
const Payment = require('./../../models/payment');

const paymentSchema = Joi.object({
    from: Joi.number().required(),
    to: Joi.number().required(),
    amount: Joi.number().required()
});

class PaymentController {

    constructor() {

    }

    static async addPayment(req, res, next) {
        let validation = paymentSchema.validate(req.body);
        if (validation.error) {
            return next(new Error(validation.error));
        }

        try {
            let from = req.body.from;
            let to = req.body.to;
            let amount = req.body.amount;

            let u1 = await User.findOne({ user_id: from });
            if (!u1) throw new Error(`User ${from} not present`);

            let u2 = await User.findOne({ user_id: to });
            if (!u2) throw new Error(`User ${to} not present`);

            u1.updateBalance(u1.balance + amount);
            u2.updateBalance(u2.balance - amount);

            //create payment history
            let payment = await Payment.createPayment(req.body);
            req.response = {
                payment_id: payment._id,
                from: payment.from,
                to: payment.to,
                amount: payment.amount
            };
            next();

        } catch (err) {
            return next(err);
        }

        next();

    }
};

module.exports = PaymentController;



