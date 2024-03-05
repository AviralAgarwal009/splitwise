'use strict';

const mongoose = require('mongoose');
const GroupSchema = require('./../schemas/group_schema');



GroupSchema.statics.getNextGroupId = async function () {

    let response = await Group.findOne({}).sort({ group_id: -1 });

    if (!response) return 1;

    return response.group_id + 1;

}


GroupSchema.statics.createGroup = async function (params) {
    let id = await Group.getNextGroupId();
    let group = new Group({
        name: params.name,
        description: params.description,
        group_id: id
    });
    return await group.save();
}

GroupSchema.statics.getAllGroups = async function () {
    return await Group.find();
}

GroupSchema.methods.addUser = async function (user_id) {
    let group = this;
    if (!group.users.includes(user_id)) {
        group.users.push(user_id);
        await group.save();
    }
}


let Group = mongoose.model('Group', GroupSchema);
module.exports = Group;
