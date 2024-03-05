'use strict';

const express = require('express');
const router = express.Router();
const UserController = require('./user_controller');


router.post('/signup', UserController.addUser);
router.get('/list/users', UserController.getAllUsers);

module.exports = router;