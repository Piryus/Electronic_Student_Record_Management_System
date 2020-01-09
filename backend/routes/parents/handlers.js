'use strict';

const Boom = require('boom');

const Parent = require('../../models/Parent');
const Student = require('../../models/Student');
const Teacher = require('../../models/Teacher');

const getChildren = async function(parentUId) {
    const parent = await Parent.findOne({ userId: parentUId });
    
    if(parent === null)
        return Boom.badRequest();

    const children = await Student.find({ _id: { $in: parent.children }});

    return { children: children.map(c => {
        return { id: c._id, ssn: c.ssn, name: c.name, surname: c.surname };
    }) };
};

const getMeetingsBooked = async function(parentUId) {
    const parent = await Parent.findOne({ userId: parentUId });
    
    if(parent === null)
        return Boom.badRequest();

    let meetings = [];

    const teachers = await Teacher.find().populate('userId');
    teachers.forEach(t => {
        const teacher = { _id: t._id, ssn: t.userId.ssn, surname: t.userId.surname, name: t.userId.name };
        t.meetings.filter(m => m.parent.equals(parent._id)).forEach(m => {
            meetings.push({ date: m.date, teacher });
        });
    });

    return { meetings };
};

module.exports = {
    getChildren,
    getMeetingsBooked
};