'use strict';

const fs = require('fs');

const mv = require('mv');

const hour = 60 * 60 * 1000;
const day = 24 * hour;

const startHour = 8, numHours = 6;

Number.prototype.roundToTwo = function() {
    return +(Math.round(this * 100) / 100);
};

String.prototype.gradify = function() {
    let n = this.replace('+', '.25').replace(/l|L| cum laude/, '').replace(/ 1\/2| and 1\/2/, '.5').replace(/(\d)\/(\d)/, '$1.75');
    return n.indexOf('-') === -1 ? parseFloat(n) : parseFloat(n.replace('-', '')) - 0.25;
};
String.prototype.isTimeIncludedInWeekhours = function(whs) {
    const h = whs.map(wh => parseInt(wh.split('_')[1]));
    const t = parseInt(this.split(':')[0]) - startHour;
    return h.includes(t);
};
String.prototype.isTimeValidFor = function(event) {
    if(event === 'late-entrance')
        return /^(08:(0[1-9]|10)|09:00)$/.test(this);
        
    return true;
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
Date.prototype.isSchoolDay = function(calendar) {
    if(this < calendar.firstDay || this > calendar.lastDay || [0, 6].includes(this.getDay()))
        return false;

    return !calendar.holidays.some(h => this.isSameDayOf(h.start) || (this > h.start && this < h.end) || (h.end !== null && this.isSameDayOf(h.end)));
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

const getAY = function(d) {
    if([6, 7].includes(d.getMonth())) // july or august
        return null;
    const y = d.getMonth() >= 8 ? d.getFullYear() : d.getFullYear() - 1;
    return y + '/' + (y + 1).toString().slice(-2);
};

const timeToDate = function(t) {
    const now = new Date(Date.now());
    const datetime = now.getFullYear() + '-' + ('0' + (now.getMonth() + 1)).slice(-2) + '-' + ('0' + now.getDate()).slice(-2) + 'T' + t + ':00';
    return new Date(datetime);
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

const getGradesAverages = function(grades) {
    let data = {};
    for(let grade of grades) {
        if(!data[grade.subject])
            data[grade.subject] = [];
        data[grade.subject].push(grade.value.gradify());
    }
    for(let d in data)
        data[d] = (data[d].reduce((a, b) => a + b, 0) / data[d].length).roundToTwo();

    return data;
};

const moveFile = function(src, dst) {
    return new Promise((resolve, reject) => {
        mv(src, dst, { mkdirp: true }, function(err) {
            if(err)
                reject(err);

            resolve();
        });
    });
};

const parseTimetablesFile = function(inputFile, schoolClasses, teachers) {
    const CLASS_SEPARATOR = '@', TEACHER_SUBJECT_SEPARATOR = ':';

    const inputData = fs.readFileSync(inputFile.path).toString().replace(/\r/gm, '');

    if(inputData.indexOf(CLASS_SEPARATOR) !== -1)
        return null;
    
    const timetableData = [];
    const classes = inputData.replace(/\n(\n)+/gm, CLASS_SEPARATOR).split(CLASS_SEPARATOR);

    for(let cl of classes) {
        cl = cl.split('\n').filter(l => l !== '').map(l => l.split('\t'));

        if(![7, 8].includes(cl.length) || cl[0][0] !== 'Class' || cl[1].join() != 'Monday,Tuesday,Wednesday,Thursday,Friday')
            return null;
            
        const classId = (schoolClasses.find(sc => sc.name === cl[0][1]) || {})._id;

        if(classId === undefined)
            return null;

        for(let i = 2; i < cl.length; i++) {
            for(let j = 0; j < cl[i].length; j++) {
                if(cl[i][j] === '')
                    continue;

                const [subject, teacherSsn] = cl[i][j].split(TEACHER_SUBJECT_SEPARATOR);
                const t = teachers.findIndex(t => t.userId.ssn === teacherSsn);

                if(t === -1 || !teachers[t].subjects.includes(subject))
                    return null;

                timetableData.push({ teacherId: teachers[t]._id, classId, subject, weekhour: [j, i-2].join('_') });
            }
        }
    }

    return timetableData;
};

module.exports = {
    hour,
    day,
    startHour,
    getRandomPassword,
    getAY,
    timeToDate,
    weekhourToDate,
    dateToWeekhour,
    getGradesAverages,
    moveFile,
    parseTimetablesFile
};