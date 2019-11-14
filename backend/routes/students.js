'use strict';

const Boom = require('boom');

const Valid = require('../validation');
const SchoolClass = require ('../models/SchoolClass');
const Student = require('../models/Student');
const Parent = require('../models/Parent');

const getGrades = async function(request, h) {
    try {
        const studentId = request.params.studentId;
        const parent = await Parent.findOne({ userId: request.auth.credentials.id });
        const student = await Student.findOne({ _id: studentId });
        if(parent === null || student === null || !parent.children.includes(student._id))
            return Boom.badRequest();
        return { grades: student.grades };
    } catch(err) {
        return Boom.badImplementation(err);
    }
};

const addStudent = async function(request, h){
    try{
        const { ssn, name, surname } = request.payload;
        const newStudent = new Student({ ssn, name, surname });
        newStudent.save();
        return {success: true};
    } catch(err) {
        return Boom.badImplementation(err);
    }
};

const addSchoolClass = async function(request, h){
    try{
        const { className, classStudents } = request.payload;
        const effectiveClassName = className.toUpperCase();
        var schoolClass = await SchoolClass.findOne({name: effectiveClassName});
        if(schoolClass === null){
            const newSchoolClass = new SchoolClass({name: effectiveClassName });
            await newSchoolClass.save();
            schoolClass = await SchoolClass.findOne({name: effectiveClassName});
        }
        const classId = schoolClass._id;
        const oldStudents = await Student.find({classId: classId});
        var index;
        for(index in oldStudents){
            if(!classStudents.includes(oldStudents[index]._id.toString())){
                oldStudents[index].classId = undefined;
                oldStudents[index].save();
            }
        }
        for(index in classStudents){
            var studentToBeUpdated = await Student.findOne({_id: classStudents[index]});
            studentToBeUpdated.classId = classId;
            studentToBeUpdated.save();
        }
        return {success: true};
    } catch(err) {
        return Boom.badImplementation(err);
    }
};

const routes = [
    {
        method: 'GET',
        path: '/grades/{studentId}',
        handler: getGrades,
        options: {
            auth: {
                strategy: 'session',
                scope: 'parent'
            },
            validate: {
                params: {
                    studentId: Valid.id.required()
                }
            }
        }
    },
    {
        method: 'POST',
        path: '/students',
        handler: addStudent,
        options: {
            auth: {
                strategy: 'session',
                scope: 'officer'
            },
            validate: {
                payload: {
                    ssn: Valid.ssn.required(),
                    name: Valid.name.required(),
                    surname: Valid.name.required()
                }
            }
        }
    },
    {
        method: 'POST',
        path: '/classes',
        handler: addSchoolClass,
        options: {
            auth: {
                strategy: 'session',
                scope: 'officer'
            },
            validate: {
                payload: {
                    className: Valid.class.required(),
                    classStudents: Valid.studentsArray.required()
                }
            }
        }
    }
];

module.exports = routes;