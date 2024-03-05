'use strict';

const mongoose = require('mongoose');
const PaymentSchema = require('./../schemas/payment_schema');

PaymentSchema.statics.createPayment = async function (params) {
    let payment = new Payment({
        to: params.to,
        from: params.from,
        amoount: params.amount
    });
    return await payment.save();
}


let Payment = mongoose.model('Payment', PaymentSchema);
module.exports = Payment;
