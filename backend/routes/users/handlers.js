'use strict';

const Boom = require('boom')

const Utils = require('../../utils');

const User = require('../../models/User');

const getUsers = async function () {
    const users = await User.find({}, { _id: 0, password: 0 });

    return { users };
};

const addUser = async function(mail, name, surname, ssn, scope) {
    const user = await User.findOne({mail});

    if (user !== null)
        return Boom.badRequest();

    const password = Utils.getRandomPassword();

    const newUser = new User({ssn, name, surname, mail, password, scope});
    await newUser.save();

    Utils.sendWelcomeEmail(mail, [name, surname].join(' '), password);

    return {success: true};
};

const updateUser = async function(userId, mail, name, surname, ssn, scope) {
    await User.updateOne({ _id: userId }, { ssn, name, surname, mail, password, scope });

    return {success: true};
};

const deleteUser = async function(userId) {
    await User.deleteOne({ _id: userId });

    return {success: true};
};

module.exports = {
    getUsers,
    addUser,
    updateUser,
    deleteUser
};
