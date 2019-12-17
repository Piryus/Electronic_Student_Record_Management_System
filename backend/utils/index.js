'use strict';

const path = require('path');

const HLib = require('@emarkk/hlib');
const Nodemailer = require('nodemailer');

const File = require('../models/File');

const keys = require('../config/keys');
const welcomeEmail = require('./welcomeEmail');

const UPLOAD_DIR = '../uploads/';
const transporter = Nodemailer.createTransport(keys.email);

const sendWelcomeEmail = function(to, fullname, password) {
    transporter.sendMail({
        from: '"ESRMS" <esrms.h@gmail.com>',
        to,
        subject: 'Your Credentials',
        html: welcomeEmail(fullname, password)
    });
};

const saveFiles = async function(files) {
    const store = files.map(async f => {
        const file = new File({ filename: f.filename, bytes: f.bytes, type: f.headers['content-type'] });
        await file.save();
        await HLib.moveFile(f.path, path.resolve(path.join(__dirname, UPLOAD_DIR + file._id)));
        
        return file._id;
    });
    const savedFiles = Promise.all(store);
    return savedFiles;
};

module.exports = {
    sendWelcomeEmail,
    saveFiles
};