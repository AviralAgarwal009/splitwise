'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const GroupSchema = new Schema({
    name: { type: String },
    description: { type: String },
    users: { type: [Number] },
    group_id: { type: Number }
}, { timestamps: true });

GroupSchema.index({ group_id: 1 }, { unique: true });

module.exports = GroupSchema;