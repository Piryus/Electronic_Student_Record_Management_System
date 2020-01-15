'use strict';

const Boom = require('boom');
const HLib = require('@emarkk/hlib');

const Calendar = require('../../models/Calendar');
const Parent = require('../../models/Parent');
const SchoolClass = require('../../models/SchoolClass');
const Student = require('../../models/Student');
const Teacher = require('../../models/Teacher');

const getNotes = async function(teacherUId) {
    const teacher = await Teacher.findOne({ userId: teacherUId });
    const students = await Student.find();

    if(teacher === null)
        return Boom.badRequest();

    const notes = students.flatMap(s => s.notes.map(n => Object.assign({
        teacherId: n.teacherId,
        description: n.description,
        date: n.date
    }, { studentId: s._id, student: [s.name, s.surname].join(' ')}))).filter(n => n.teacherId.equals(teacher._id)).sort((a, b) => b.date - a.date);

    return { notes };
};

const getTimetable = async function(classId) {
    const teachers = await Teacher.find().populate('userId');
    
    const timetable = teachers.filter(t => t.timetable.some(w => w.classId.equals(classId))).flatMap(t => {
        const teacherInfo = { _id: t._id, ssn: t.userId.ssn, surname: t.userId.surname, name: t.userId.name };
        return t.timetable.filter(w => w.classId.equals(classId)).map(w => {
            return { weekhour: w.weekhour, subject: w.subject, teacher: teacherInfo };
        });
    });
    
    return { timetable };
};

const getMeetingsAvailability = async function(teacherUId) {
    const teacher = await Teacher.findOne({ userId: teacherUId });
    
    if(teacher === null)
        return Boom.badRequest();

    return { timeSlots: teacher.meetingsTimeSlots };
};

const getAvailableMeetingsSlots = async function(parentUId, teacherId) {
    const parent = await Parent.findOne({ userId: parentUId });
    const teacher = await Teacher.findById(teacherId);
    const calendar = await Calendar.findOne({ academicYear: HLib.getAY(new Date(Date.now())) });

    if(parent === null || teacher === null)
        return Boom.badRequest();

    const children = await Student.find({ _id: { $in: parent.children }});

    if(!teacher.timetable.some(w => children.map(c => c.classId.toString()).includes(w.classId.toString())))
        return Boom.badRequest();

    const slots = teacher.meetingsTimeSlots.flatMap(s => {
        let sl = [];
        for(let i = 0; i < 3; i++) {
            const base = HLib.weekhourToDate(s).addDays(i * 7);
            if(base.isSchoolDay(calendar))
                sl = sl.concat([...Array(4).keys()].map(x => new Date(base.getTime() + x * 15*60*1000)));
        }
        return sl;
    }).sort((a, b) => a.getTime() - b.getTime()).slice(0, teacher.meetingsTimeSlots.length * 4).map(s => {
        return { date: s, available: !teacher.meetings.some(m => m.date.getTime() === s.getTime()) };
    });

    return { slots };
};

const getTermGrades = async function(teacherUId) {
    const teacher = await Teacher.findOne({ userId: teacherUId });
    
    if(teacher === null)
        return Boom.badRequest();

    const schoolClass = await SchoolClass.findOne({ coordinator: teacher._id });
    
    if(schoolClass === null)
        return Boom.badRequest();
        
    const endedTerms = schoolClass.termsEndings.length;
    const students = await Student.find({ classId: schoolClass._id });
    
    let result = {
        assigned: [0, 1].map(i => endedTerms > i),
        termGrades: [0, 1].map(i => {
            return endedTerms > i ? students.map(s => {
                return {
                    studentId: s._id,
                    surname: s.surname,
                    name: s.name,
                    grades: s.termGrades[i]
                };
            }) : null;
        }),
        gradesSuggestions: [0, 1].map(i => {
            return endedTerms === i ? students.map(s => {
                return {
                    studentId: s._id,
                    surname: s.surname,
                    name: s.name,
                    grades: HLib.getGradesAverages(s.grades.filter(g => i === 0 || g.date > schoolClass.termsEndings[0]))
                };
            }) : null;
        })
    };

    return result;
};

const setMeetingsAvailability = async function(teacherUId, timeSlots) {
    const teacher = await Teacher.findOne({ userId: teacherUId });
    
    if(teacher === null || teacher.timetable.some(t => timeSlots.includes(t.weekhour)))
        return Boom.badRequest();

    teacher.meetingsTimeSlots = timeSlots;
    await teacher.save();

    return { success: true };
};

const bookMeetingSlot = async function(parentUId, teacherId, datetime) {
    const parent = await Parent.findOne({ userId: parentUId });
    const teacher = await Teacher.findById(teacherId);
    const calendar = await Calendar.findOne({ academicYear: HLib.getAY(new Date(Date.now())) });

    if(parent === null || teacher === null)
        return Boom.badRequest();

    const children = await Student.find({ _id: { $in: parent.children }});

    if(!teacher.timetable.some(w => children.map(c => c.classId.toString()).includes(w.classId.toString())))
        return Boom.badRequest();

    datetime = new Date(datetime.getTime() - datetime.getTime() % (15*60*1000));
    if(datetime < Date.now() || !datetime.isSchoolDay(calendar))
        return Boom.badRequest();
        
    const t = datetime.getTime() - datetime.getTime() % (60*60*1000);
    if(!teacher.meetingsTimeSlots.map(s => HLib.weekhourToDate(s)).some(s => s.getTime() === t) || teacher.meetings.some(m => m.date.getTime() === datetime.getTime()))
        return Boom.badRequest();

    teacher.meetings.push({ parent: parent._id, date: datetime });
    await teacher.save();

    return { success: true };
};

const publishTermGrades = async function(teacherUId, gradesInfo) {
    const teacher = await Teacher.findOne({ userId: teacherUId });
    
    if(teacher === null)
        return Boom.badRequest();

    const schoolClass = await SchoolClass.findOne({ coordinator: teacher._id });
    
    if(schoolClass === null || schoolClass.termsEndings.length === 2)
        return Boom.badRequest();

    let students = await Student.find({ classId: schoolClass._id });

    if(students.length !== gradesInfo.length || students.map(s => s._id.toString()).some(s => !gradesInfo.map(g => g.studentId).includes(s)))
        return Boom.badRequest();

    const teachers = await Teacher.find();
    const schoolClassSubjects = [...new Set(teachers.flatMap(t => t.timetable).filter(w => schoolClass._id.equals(w.classId)).map(w => w.subject))];

    for(let g of gradesInfo) {
        if(Object.keys(g.grades).length !== schoolClassSubjects.length || Object.keys(g.grades).some(s => !schoolClassSubjects.includes(s)))
            return Boom.badRequest();
    }

    students = students.map(s => {
        s.termGrades.push(gradesInfo.find(g => s._id.equals(g.studentId)).grades);
        return s;
    });

    schoolClass.termsEndings.push(new Date(Date.now()));
    await schoolClass.save();
    
    await Promise.all(students.map(s => s.save()));

    return { success: true };
};

module.exports = {
    getNotes,
    getTimetable,
    getMeetingsAvailability,
    getAvailableMeetingsSlots,
    getTermGrades,
    setMeetingsAvailability,
    bookMeetingSlot,
    publishTermGrades
};