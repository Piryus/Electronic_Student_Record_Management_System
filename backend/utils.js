const startHour = 8, numHours = 6;

Date.prototype.getNormalizedDay = function() {
    return this.getDay() === 0 ? 6 : this.getDay() - 1;
}
Date.prototype.weekStart = function() {
    let ws = new Date();
    ws.setHours(0, 0, 0, 0);
    ws.setDate(ws.getDate() - ws.getNormalizedDay());
    return ws;
}

const weekhourToDate = function(wh) {
    let d = new Date();
    const [weekdayIndex, hourIndex] = wh.split('_');

    // transform (sunday = 0, monday = 1, ..) into (monday = 0, .., sunday = 6)
    const daysDelta = weekdayIndex - d.getNormalizedDay();
    
    d.setDate(d.getDate() + daysDelta);
    d.setHours(hourIndex + startHour, 0, 0, 0);
    return d;
};

const dateToWeekhour = function(d) {
    // saturday (6) and sunday (0) have to be excluded
    if([0,6].includes(d.getDay()) || d.getHours() < startHour || d.getHours > (startHour + numHours))
        return null;

    const weekdayIndex = d.getDay() - 1;
    const hourIndex = d.getHours() - startHour;
    return weekdayIndex + '_' + hourIndex;
};

module.exports = {
    weekhourToDate,
    dateToWeekhour
};