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

const getTeachers = async function() {
    const rawTeachers = await Teacher.find().populate('userId');
    const teachers = rawTeachers.map(t => {
        return { id: t._id, ssn: t.userId.ssn, name: t.userId.name, surname: t.userId.surname, mail: t.userId.mail };
    });

    return { teachers };
};

const getArticles = async function() {
    const articles = await Article.find({}).populate({
        path: 'authorId',
        select: 'name surname'
    });

    return { articles: articles.sort((a, b) => b.date - a.date) };
};

const getParents = async function() {
    const parents = await User.find({ firstLogin: true, scope: 'parent' }).select('ssn name surname mail');
    
    return parents;
};

const updateTeacher = async function(teacherId, ssn, name, surname, mail) {
    const teacher = await Teacher.findById(teacherId);

    if(teacher === null)
        return Boom.badRequest();

    await User.updateOne({ _id: teacher.userId }, { ssn, name, surname, mail });

    return { success: true };
};

const addArticle = async function(officerUId, title, content) {
    const article = new Article({ title, content, authorId: officerUId });
    await article.save();

    return { success: true };
};

const addParent = async function(ssn, name, surname, mail, childSsn) {
    const existingUser = await User.findOne({ mail });
    const student = await Student.findOne({ ssn: childSsn });

    if(existingUser !== null || student === null)
        return Boom.badRequest();
    
    const password = HLib.getRandomPassword();

    const user = new User({ ssn, name, surname, mail, password, scope: ['parent'], firstLogin: true });
    await user.save();
    const parent = new Parent({ userId: user._id, children: [student._id] });
    await parent.save();

    Utils.sendWelcomeEmail(mail, name + ' ' + surname, password);

    return { success: true };
};

const sendCredentials = async function(parents) {
    for(const parentUId of parents) {
        const user = await User.findById(parentUId);
        Utils.sendWelcomeEmail(user.mail, user.name + ' ' + user.surname, user.password);
    }

    return { success: true };
};

const publishTimetables = async function(timetablesFile) {
    const schoolClasses = await SchoolClass.find();
    let teachers = await Teacher.find().populate('userId');

    const timetableEntries = HLib.parseTimetablesFile(timetablesFile, schoolClasses, teachers);

    if(timetableEntries === null)
        return Boom.badRequest();

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
    getTeachers,
    getArticles,
    getParents,
    updateTeacher,
    addArticle,
    addParent,
    sendCredentials,
    publishTimetables
};