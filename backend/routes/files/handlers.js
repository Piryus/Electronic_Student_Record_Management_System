'use strict';

const Boom = require('boom');

const File = require('../../models/File');
const Parent = require('../../models/Parent');
const SchoolClass = require ('../../models/SchoolClass');
const Student = require('../../models/Student');

const get = async function(h, parentUId, fileId) {
    const parent = await Parent.findOne({ userId: parentUId });

    if(parent === null || parent.children.length === 0)
        return Boom.badRequest();

    const students = await Student.find({ _id: { $in: parent.children }});
    
    if(students.length !== parent.children.length)
        return Boom.badRequest();
    
    const schoolClasses = await SchoolClass.find({ _id: { $in: students.map(s => s.classId) }});
    
    if(!schoolClasses.flatMap(sc => [...sc.assignments, ...sc.supportMaterials]).flatMap(x => x.attachments).some(a => a.toString() === fileId))
        return Boom.badRequest();

    const file = await File.findOne({ _id: fileId });
    return h.file(fileId, {
        mode: 'attachment',
        filename: file.filename
    });
};

module.exports = {
    get
};