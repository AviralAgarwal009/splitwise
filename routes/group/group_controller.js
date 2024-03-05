'use strict';

const Group = require('./../../models/group');
const User = require('./../../models/user');
const Expense = require('./../../models/expense');


class GroupController {

    constructor() {

    }

    static async createGroup(req, res, next) {

        try {
            let name = req.body.name;
            let description = req.body.description;
            let group = await Group.createGroup({
                name, description
            });

            req.response = {
                name: group.name,
                description: group.description,
                group_id: group.group_id
            }
            next();
        } catch (err) {
            return next(err);
        }
    }

    static async getAllGroups(req, res, next) {

        try {

            let groups = await Group.getAllGroups();

            if (!groups || groups.length == 0) {
                throw new Error('No groups found');
            }

            let groupsList = [];
            for (let group of groups) {
                let currentGroup = {
                    name: group.name,
                    group_id: group.group_id
                };
                groupsList.push(currentGroup);
            }

            req.response = {
                groupsList
            }
            next();

        } catch (err) {
            next(err);
        }
    }

    static async addUserToGroup(req, res, next) {

        try {
            let user_id = req.body.user_id;
            let group_id = req.body.group_id;
            if (!user_id || !group_id) {
                throw new Error('Invalid request body');
            }

            let user = await User.findOne({ user_id: user_id });
            if (!user) throw new Error(`Invalid user ${user_id}`);

            let group = await Group.findOne({ group_id: group_id });
            if (!group) throw new Error(`Invalid group ${group_id}`);

            group.addUser(user_id);
            user.addGroup(group_id);

            req.response = {
                status: "User added succsessfully to the group"
            }

            next();


        } catch (err) {
            next(err);
        }
    }

    static async getGroupExpenseHistory(req, res, next) {
        try {
            let group_id = req.query.group_id;
            let group = await Group.findOne({ group_id: group_id });
            if (!group) throw new Error(`Group ${group_id} does not exist`);

            let expenseHistory = await Expense.getGroupExpenseHistory(group_id);
            let response = [];
            for (let history of expenseHistory) {
                let historyObject = {
                    amount: history.amount,
                    category: history.category,
                    description: history.description
                }
                response.push(historyObject);
            }
            req.response = response;

            next();

        } catch (err) {
            return next(err);
        }
    }

};

module.exports = GroupController;



