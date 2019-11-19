'use strict';

const Boom = require('boom');
const Utils = require('../utils');
const Valid = require('../validation');
const User = require('../models/User');
const Parent = require('../models/Parent');
const Student = require('../models/Student');

const getRandomPassword = function () {
    const chars = "abcdefghijklmnopqrstuvwxyz!@#$%^&*()-+<>ABCDEFGHIJKLMNOP1234567890";
    let password = "";
    for (let x = 0; x < 16; x++) {
        let i = Math.floor(Math.random() * chars.length);
        password += chars.charAt(i);
    }
    return password;
};

const addParent = async function (request, h) {
    try {
        const {mail, nameParent, surnameParent, ssnParent, ssnChild} = request.payload;
        const user = await User.findOne({mail});
        const child = await Student.findOne({ssn: ssnChild});
        if (user !== null || child === null) {
            // Parent already in DB or child not found
            return Boom.badRequest();
        } else {
            const password = getRandomPassword();
            const newUser = new User({mail, password, scope: ['parent']});
            await newUser.save();
            const newParent = new Parent({
                userId: newUser._id,
                ssn: ssnParent,
                name: nameParent,
                surname: surnameParent,
                children: [child._id]
            });
            await newParent.save();
            Utils.sendWelcomeEmail(mail, surnameParent + ' ' + nameParent, password);
            return {success: true};
        }
    } catch (err) {
        return Boom.badImplementation(err);
    }
};

const routes = [
    // Route to add a parent into the database
    {
        method: 'POST',
        path: '/parent/add',
        handler: addParent,
        options: {
            auth: {
                strategy: 'session',
                scope: 'officer'
            },
            validate: {
                payload: {
                    mail: Valid.mail.required(),
                    nameParent: Valid.name.required(),
                    surnameParent: Valid.name.required(),
                    ssnParent: Valid.ssn.required(),
                    ssnChild: Valid.ssn.required()
                }
            }
        }
    },
];

module.exports = routes;