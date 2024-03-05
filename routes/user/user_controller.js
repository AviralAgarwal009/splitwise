'use strict';

const Joi = require('joi');
const User = require('./../../models/user');

const userSchema = Joi.object({
    name: Joi.string().regex(/^[a-zA-Z ]+$/).required().messages({
        'string.pattern.base': 'Name should contain alphabets and spaces only'
    }),
    phone: Joi.string().pattern(/^[0-9]{10}$/).required().messages({
        'string.pattern.base': 'Phone number should be exactly 10 digits'
    })
});

class UserController {

    static async addUser(req, res, next) {

        const validate = userSchema.validate(req.body);

        if (validate.error) {
            return next(new Error(validate.error.message));
        }

        try {
            let userParams = {
                name: req.body.name,
                phone: req.body.phone
            }
            let response = await User.createUser(userParams);
            req.response = {
                message: "User created successfully",
                user_id: response.user_id,
                name: response.name,
                phone: response.phone
            }
            next();

        } catch (err) {
            return next(err);
        }


    }

    static async getAllUsers(req, res, next) {
        try {

            let users = await User.getAllUsers();

            if (!users || users.length == 0) {
                throw new Error('No users found');
            }

            let usersList = [];
            for (let user of users) {
                let currentUser = {
                    name: user.name,
                    user_id: user.user_id
                };
                usersList.push(currentUser);
            }

            req.response = {
                usersList
            }
            next();

        } catch (err) {
            next(err);
        }

    }

}

module.exports = UserController;