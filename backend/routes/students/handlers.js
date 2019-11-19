const Boom = require('boom');

const Parent = require('../../models/Parent');
const SchoolClass = require ('../../models/SchoolClass');
const Student = require('../../models/Student');

const getGrades = async function(parentUId, studentId) {
    const parent = await Parent.findOne({ userId: parentUId });
    const student = await Student.findOne({ _id: studentId });
    if(parent === null || student === null || !parent.children.includes(student._id))
        return Boom.badRequest();
    return { grades: student.grades };
};

const addStudent = async function(ssn, name, surname) {
    const newStudent = new Student({ ssn, name, surname });
    await newStudent.save();
    return {success: true};
};

const addSchoolClass = async function(name, students) {
    let schoolClass = await SchoolClass.findOneAndUpdate({ name: name.toUpperCase() }, {}, { upsert: true });
    schoolClass = await SchoolClass.findOne({ name: name.toUpperCase()});
    await Student.updateMany({ classId: schoolClass._id }, { classId: undefined });
    await Student.updateMany({ _id: { $in: students } }, { classId: schoolClass._id });
    return { success: true };
};

const getAllStudents = async function() {
    const students = await Student.find({});
    return { students };
};

const getAllClasses = async function() {
    const classes = await SchoolClass.find({});
    return { classes };
};

module.exports = {
    getGrades,
    addStudent,
    addSchoolClass,
    getAllStudents,
    getAllClasses
};