const Boom = require('boom');

const Parent = require('../../models/Parent');
const SchoolClass = require ('../../models/SchoolClass');
const Student = require('../../models/Student');

const getGrades = async function(parentUId, studentId) {
    const parent = await Parent.findOne({ userId: parentUId });
    const student = await Student.findOne({ _id: studentId }, { 'grades._id': 0 });
    if(parent === null || student === null || !parent.children.includes(student._id))
        return Boom.badRequest();
    return { grades: student.grades };
};

const getAttendance = async function(parentUId, studentId) {
    const parent = await Parent.findOne({ userId: parentUId });
    const student = await Student.findOne({ _id: studentId }, { 'attendanceEvents._id': 0 });
    if(parent === null || student === null || !parent.children.includes(student._id))
        return Boom.badRequest();
    return { attendance: student.attendanceEvents };
};

const addStudent = async function(ssn, name, surname) {
    const newStudent = new Student({ ssn, name, surname });
    await newStudent.save();
    return {success: true};
};

const addSchoolClass = async function(name, students) {
    const schoolClass = await SchoolClass.findOneAndUpdate({ name: name.toUpperCase() }, {}, { new: true, upsert: true });
    await Student.updateMany({ classId: schoolClass._id }, { classId: undefined });
    await Student.updateMany({ _id: { $in: students } }, { classId: schoolClass._id });
    return { success: true };
};

const getAllStudents = async function() {
    const students = await Student.find({}, { 'grades._id': 0 });
    return { students };
};

const getAllClasses = async function() {
    const classes = await SchoolClass.find({});
    return { classes };
};

const addGradeToStudent = async function (id, subject, grade) {
    try {        
        var student = await Student.findOne({ _id: id });
        student.grades.push(
            {
                value: grade,
                subject: subject,
                date: Date.now().toString()
            }
        );
        await student.save();
        return {success: true};
    } catch (err) {
        return Boom.badImplementation(err);
    }
};

module.exports = {
    getGrades,
    getAttendance,
    addStudent,
    addSchoolClass,
    addGradeToStudent,
    getAllStudents,
    getAllClasses
};