const Nodemailer = require('nodemailer');

const keys = require('../config/keys');
const welcomeEmail = require('./welcomeEmail');

const transporter = Nodemailer.createTransport(keys.email);

const sendWelcomeEmail = function(to, fullname, password) {
    transporter.sendMail({
        from: '"ESRMS" <esrms.h@gmail.com>',
        to,
        subject: 'Your Credentials',
        html: welcomeEmail(fullname, password)
    });
};

module.exports = {
    sendWelcomeEmail
};