const hour = 60 * 60 * 1000;
const day = 24 * hour;

const startHour = 8, numHours = 6;

String.prototype.gradify = function() {
    let n = this.replace('+', '.25').replace(/l|L| cum laude/, '').replace(/ 1\/2| and 1\/2/, '.5').replace(/(\d)\/(\d)/, '$1.75');
    return n.indexOf('-') === -1 ? parseFloat(n) : parseFloat(n.replace('-', '')) - 0.25;
};

Date.prototype.shortString = function() {
    return this.getDate() + '/' + this.getMonth();
};
Date.prototype.longString = function() {
    return this.toLocaleDateString() + ' ' + this.toLocaleTimeString();
};
Date.prototype.isSameDayOf = function(d) {
    return this.getFullYear() === d.getFullYear() && this.getMonth() === d.getMonth() && this.getDate() === d.getDate();
};
Date.prototype.addDays = function(d) {
    return new Date(this.getTime() + d * day);
};
Date.prototype.dayStart = function() {
    this.setMinutes(0, 0, 0);
    this.setTime(this.getTime() - this.getHours() * hour);
    return this;
};
Date.prototype.getNormalizedDay = function() {
    return this.getDay() === 0 ? 6 : this.getDay() - 1;
};
Date.prototype.weekStart = function() {
    let ws = new Date(this.getTime());
    ws.setMinutes(0, 0, 0);
    ws.setTime(ws.getTime() - ws.getNormalizedDay() * day - ws.getHours() * hour);
    return ws;
};

const getRandomPassword = function () {
    const chars = 'abcdefghijklmnopqrstuvwxyz!@#$%^&*()-+<>ABCDEFGHIJKLMNOP1234567890';
    let password = '';
    for (let x = 0; x < 16; x++) {
        let i = Math.floor(Math.random() * chars.length);
        password += chars.charAt(i);
    }
    return password;
};

const weekhourToDate = function(wh) {
    let d = new Date(Date.now()).weekStart();
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

module.exports = {
    hour,
    day,
    startHour,
    getRandomPassword,
    weekhourToDate,
    dateToWeekhour
};