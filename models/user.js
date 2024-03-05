'use strict';

const mongoose = require('mongoose');
const UserSchema = require('./../schemas/user_schema');


UserSchema.statics.getNextUserId = async function () {

    let response = await User.findOne({}).sort({ user_id: -1 });

    if (!response) return 1;

    return response.user_id + 1;

}


UserSchema.statics.createUser = async function (params) {

    let id = await User.getNextUserId();
    let user = new User({
        user_id: id,
        name: params.name,
        phone: params.phone
    });

    return await user.save();
}

UserSchema.statics.getAllUsers = async function () {
    let response = await User.find();
    return response;
}

UserSchema.statics.updateUserBalances = async function (finalBalances) {

    for (let userData of finalBalances) {
        await User.findOneAndUpdate(
            { user_id: userData.user_id },
            { $inc: { balance: -userData.amount } }
        );
    }

}

UserSchema.methods.updateBalance = async function (updatedBalance) {
    let user = this;
    user.balance = updatedBalance;
    await user.save();
}

UserSchema.methods.addGroup = async function (group_id) {
    let user = this;
    if (!user.groups.includes(group_id)) {
        user.groups.push(group_id);
        await user.save();
    }
}


let User = mongoose.model('User', UserSchema);
module.exports = User;
