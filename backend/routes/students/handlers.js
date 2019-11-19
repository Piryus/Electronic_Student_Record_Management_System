const Boom = require('boom');

const Parent = require('../../models/Parent');
const SchoolClass = require ('../../models/SchoolClass');
const Student = require('../../models/Student');

const getGrades = async function(parentUId, studentId) {
    try {
        const parent = await Parent.findOne({ userId: parentUId });
        const student = await Student.findOne({ _id: studentId });
        if(parent === null || student === null || !parent.children.includes(student._id))
            return Boom.badRequest();
        return { grades: student.grades };
    } catch(err) {
        return Boom.badImplementation(err);
    }
};

const addStudent = async function(ssn, name, surname) {
    try {
        const newStudent = new Student({ ssn, name, surname });
        await newStudent.save();
        return {success: true};
    } catch(err) {
        return Boom.badImplementation(err);
    }
};

const addSchoolClass = async function(name, students) {
    try {
        var schoolClass = await SchoolClass.findOneAndUpdate({ name: name.toUpperCase() }, {}, { upsert: true });
        schoolClass = await SchoolClass.findOne({ name: name.toUpperCase()});
        await Student.updateMany({ classId: schoolClass._id }, { classId: undefined });
        await Student.updateMany({ _id: { $in: students } }, { classId: schoolClass._id });
        return { success: true };
    } catch(err) {
        return Boom.badImplementation(err);
    }
};

const getAllStudents = async function() {
    try {
        const students = await Student.find({});
        return { students };
    } catch(err) {
        return Boom.badImplementation(err);
    }
};

const getAllClasses = async function() {
    try {
        const classes = await SchoolClass.find({});
        return { classes };
    } catch(err) {
        return Boom.badImplementation(err);
    }
};

module.exports = {
    getGrades,
    addStudent,
    addSchoolClass,
    getAllStudents,
    getAllClasses
};