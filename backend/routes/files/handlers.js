'use strict';

const Boom = require('boom');

const Parent = require('../../models/Parent');
const SchoolClass = require ('../../models/SchoolClass');
const Student = require('../../models/Student');

const get = async function(parentUId, fileId) {
    const parent = await Parent.findOne({ userId: parentUId });

    if(parent === null || !parent.children || parent.children.length === 0)
        return Boom.badRequest();

    const students = await Student.find({ _id: { $in: parent.children }});
    
    if(students.length !== parent.children.length)
        return Boom.badRequest();
    
    const schoolClasses = await SchoolClass.find({ _id: { $in: students.map(s => s.classId) }});
    
    if(!schoolClasses.flatMap(sc => [...sc.assignments, ...sc.supportMaterials]).flatMap(x => x.attachments).includes(fileId))
        return Boom.badRequest();

    // TODO: serve file here
    return { success: true };
};

module.exports = {
    get
};