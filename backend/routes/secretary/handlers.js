'use strict';

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
    const schoolClasses = await SchoolClass.find();
    let teachers = await Teacher.find().populate('userId');

    const timetableEntries = HLib.parseTimetablesFile(timetablesFile, schoolClasses, teachers);

    teachers = teachers.map(t => {
        t.timetable = timetableEntries.filter(e => t._id.equals(e.teacherId)).map(e => {
            return { classId: e.classId, subject: e.subject, weekhour: e.weekhour };
        })
        return t;
    });

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