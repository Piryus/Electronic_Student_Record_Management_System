const Nodemailer = require('nodemailer');

const keys = require('../config/keys');
const welcomeEmail = require('./welcomeEmail');

const hour = 60 * 60 * 1000;
const day = 24 * hour;

const startHour = 8, numHours = 6;
const transporter = Nodemailer.createTransport(keys.email);

Date.prototype.getNormalizedDay = function() {
    return this.getDay() === 0 ? 6 : this.getDay() - 1;
}
Date.prototype.weekStart = function() {
    let ws = new Date(this.getTime());
    ws.setMinutes(0, 0, 0);
    ws.setTime(ws.getTime() - ws.getNormalizedDay() * day - ws.getHours() * hour);
    return ws;
}

const weekhourToDate = function(wh) {
    let d = new Date().weekStart();
    const [weekdayIndex, hourIndex] = wh.split('_').map(x => parseInt(x));

    d.setTime(d.getTime() + weekdayIndex * day + (hourIndex + startHour) * hour);
    return d;
};

const dateToWeekhour = function(d) {
    // saturday (6) and sunday (0) have to be excluded
    if([0, 6].includes(d.getDay()) || d.getHours() < startHour || d.getHours() > (startHour + numHours - 1))
        return null;

    const weekdayIndex = d.getDay() - 1;
    const hourIndex = d.getHours() - startHour;
    return weekdayIndex + '_' + hourIndex;
};

const sendWelcomeEmail = function(to, fullname, password) {
    transporter.sendMail({
        from: '"ESRMS" <esrms.h@gmail.com>',
        to,
        subject: 'Your Credentials',
        html: welcomeEmail(fullname, password)
    });
};

module.exports = {
    hour,
    day,
    startHour,
    weekhourToDate,
    dateToWeekhour,
    sendWelcomeEmail
};