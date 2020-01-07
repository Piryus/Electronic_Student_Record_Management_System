'use strict';

const Boom = require('boom');

const Parent = require('../../models/Parent');
const Student = require('../../models/Student');

const getChildren = async function(parentUId) {
    const parent = await Parent.findOne({ userId: parentUId });
    
    if(parent === null)
        return Boom.badRequest();

    const children = await Student.find({ _id: { $in: parent.children }});

    return { children: children.map(c => {
        return { id: c._id, ssn: c.ssn, name: c.name, surname: c.surname };
    }) };
};

module.exports = {
    getChildren
};