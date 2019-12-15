'use strict';

const fs = require('fs');

const Boom = require('boom');
const HLib = require('@emarkk/hlib');

const Utils = require('../../utils');

const Article = require('../../models/Article');
const Parent = require('../../models/Parent');
const SchoolClass = require('../../models/SchoolClass');
const Student = require('../../models/Student');
const Teacher = require('../../models/Teacher');
const User = require('../../models/User');

const getArticles = async function() {
    const articles = await Article.find({}).populate({
        path: 'authorId',
        select: 'name surname'
    });

    return { articles: articles.sort((a, b) => b.date - a.date) };
};

const addArticle = async function(officerUId, title, content) {
    const article = new Article({ title, content, authorId: officerUId });
    await article.save();

    return { success: true };
};

const getParents = async function() {
    const parents = await User.find({firstLogin: true, scope: 'parent'})
        .select('ssn name surname mail');
    return parents;
};

const addParent = async function(ssn, name, surname, mail, childSsn) {
    const existingUser = await User.findOne({ mail });
    const student = await Student.findOne({ ssn: childSsn });

    if(existingUser !== null || student === null)
        return Boom.badRequest();
    
    const password = HLib.getRandomPassword();

    const user = new User({ ssn, name, surname, mail, password, scope: ['parent'], firstLogin: true });
    await user.save();
    const parent = new Parent({ userId: user._id, children: [student._id], firstLogin: true });
    await parent.save();

    Utils.sendWelcomeEmail(mail, name + ' ' + surname, password);

    return { success: true };
};

const sendCredentials = async function(parents) {
    for (const parentUserId of parents) {
        const user = await User.findOne({_id: parentUserId});
        Utils.sendWelcomeEmail(user.mail, user.name + ' ' + user.surname, user.password);
    }
    return { success: true };
};

const publishTimetables = async function(timetablesFile) {
    const CLASS_SEPARATOR = '@', TEACHER_SUBJECT_SEPARATOR = ':';
    const schoolClasses = await SchoolClass.find();
    let teachers = await Teacher.find().populate('userId');

    teachers = teachers.map(t => {
        t.timetable = [];
        return t;
    });

    if(timetablesFile.headers['content-type'] !== 'text/csv')
        return Boom.badRequest();

    const input = fs.readFileSync(timetablesFile.path).toString().replace(/\r/g, '');

    if(input.indexOf(CLASS_SEPARATOR) !== -1)
        return Boom.badRequest();
    
    const classes = input.replace(/\n(\n)+/, CLASS_SEPARATOR).split(CLASS_SEPARATOR);

    for(let c of classes) {
        const data = c.split('\n').filter(l => l !== '').map(l => l.split('\t'));

        if(![7, 8].includes(data.length) || data[0][0] !== 'Class' || data[1].join() != 'Monday,Tuesday,Wednesday,Thursday,Friday')
            return Boom.badRequest();
            
        const classId = (schoolClasses.find(sc => sc.name === data[0][1]) || {})._id;

        if(classId === undefined)
            return Boom.badRequest();

        for(let i = 2; i < data.length; i++) {
            for(let j = 0; j < data[i].length; j++) {
                const [subject, teacherSsn] = data[i][j].split(TEACHER_SUBJECT_SEPARATOR);
                const t = teachers.findIndex(t => t.userId.ssn === teacherSsn);
                if(t !== -1)
                    teachers[t].timetable.push({ classId, subject, weekhour: [j, i-2].join('_') });
            }
        }
    }

    await Promise.all(teachers.map(t => t.save()));

    return { success: true };
};

module.exports = {
    getArticles,
    addArticle,
    addParent,
    getParents,
    sendCredentials,
    publishTimetables
};