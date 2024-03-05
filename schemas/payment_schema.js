'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PaymentSchema = new Schema({
    from: { type: Number, ref: "User" },
    to: { type: Number, ref: "User" },
    amount: { type: Number }
}, { timestamps: true });

module.exports = PaymentSchema;