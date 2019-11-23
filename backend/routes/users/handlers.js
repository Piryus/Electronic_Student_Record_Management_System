'use strict';

const Boom = require('boom')
const Utils = require('../../utils');
const User = require('../../models/User');

const addUser = async function (mail, name, surname, ssn, scope) {
    try {
        const user = await User.findOne({mail});
        if (user === null) {
            const password = Utils.getRandomPassword();
            const newUser = new User({ssn, name, surname, mail, password, scope});
            await newUser.save();
            Utils.sendWelcomeEmail(mail, [name, surname].join(' '), password);
            return {success: true};
        } else {
            return Boom.badRequest('The user already exists.');
        }
    } catch (err) {
        return Boom.badImplementation(err);
    }
};

const getUsers = async function () {
    try {
        const usersWithPasswords = await User.find({});
        return usersWithPasswords.map((user) => {
            return {
                ssn: user.ssn,
                name: user.name,
                surname: user.surname,
                mail: user.mail,
                scope: user.scope
            };
        });
    } catch (e) {
        return Boom.badImplementation(e);
    }
};

module.exports = {
    addUser,
    getUsers
};
