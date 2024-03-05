'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    user_id: { type: Number },
    name: { type: String },
    phone: { type: Number },
    balance: { type: Number, default: 0 },
    groups: {type:[Number]}
}, { timestamps: true });


UserSchema.index({ user_id: 1 }, { unique: true });

module.exports = UserSchema;