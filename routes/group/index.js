'use strict';

const express = require('express');
const router = express.Router();
const GroupController = require('./group_controller');

router.post('/create/group', GroupController.createGroup);

router.get('/list/groups', GroupController.getAllGroups);

router.post('/group/add/user', GroupController.addUserToGroup);

router.get('/group/expense/history', GroupController.getGroupExpenseHistory)

module.exports = router;