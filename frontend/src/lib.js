const hour = 60 * 60 * 1000;
const day = 24 * hour;

const startHour = 8, numHours = 6;

Date.prototype.shortString = function() {
    return this.getDate() + '/' + this.getMonth();
}
Date.prototype.longString = function() {
    return this.toLocaleDateString() + ' ' + this.toLocaleTimeString();
}
Date.prototype.addDays = function(d) {
    return new Date(this.getTime() + d * day);
}
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

export default {
    weekhourToDate
};