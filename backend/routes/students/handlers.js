'use strict';

const Boom = require('boom');
const HLib = require('@emarkk/hlib');

const Calendar = require('../../models/Calendar');
const Parent = require('../../models/Parent');
const SchoolClass = require ('../../models/SchoolClass');
const Student = require('../../models/Student');
const Teacher = require('../../models/Teacher');
const User = require('../../models/User');

const getTeachers = async function(parentUId, studentId) {
    const parent = await Parent.findOne({ userId: parentUId });
    const student = await Student.findOne({ _id: studentId });

    if(parent === null || student === null || !parent.children.includes(student._id))
        return Boom.badRequest();

    const allTeachers = await Teacher.find().populate('userId');
    const studentTeachers = allTeachers.filter(t => t.timetable.some(w => w.classId.equals(student.classId)));
    const teachers = studentTeachers.map(t => {
        return {
            id: t._id,
            ssn: t.userId.ssn,
            name: t.userId.name,
            surname: t.userId.surname,
            subjects: [...new Set(t.timetable.filter(w => w.classId.equals(student.classId)).map(w => w.subject))]
        };
    })

    return { teachers };
};

const getGrades = async function(parentUId, studentId) {
    const parent = await Parent.findOne({ userId: parentUId });
    const student = await Student.findOne({ _id: studentId }, { 'grades._id': 0 });

    if(parent === null || student === null || !parent.children.includes(student._id))
        return Boom.badRequest();

    const schoolClass = await SchoolClass.findById(student.classId);

    if(schoolClass === null)
        return Boom.badRequest();

    if(schoolClass.termsEndings.length === 2)
        return { grades: [] };
        
    const calendar = await Calendar.findOne({ academicYear: HLib.getAY(new Date(Date.now())) });
    const from = schoolClass.termsEndings.length === 0 ? calendar.firstDay : schoolClass.termsEndings[0].addDays(1);

    return { grades: student.grades.filter(g => g.date.isSameDayOf(from) || g.date > from) };
};

const getTermGrades = async function(parentUId, studentId) {
    const parent = await Parent.findOne({ userId: parentUId });
    const student = await Student.findOne({ _id: studentId }, { 'grades._id': 0 });

    if(parent === null || student === null || !parent.children.includes(student._id))
        return Boom.badRequest();

    return { termGrades: student.termGrades };
};

const getAttendance = async function(parentUId, studentId) {
    const parent = await Parent.findOne({ userId: parentUId });
    const student = await Student.findOne({ _id: studentId }, { 'attendanceEvents._id': 0 });

    if(parent === null || student === null || !parent.children.includes(student._id))
        return Boom.badRequest();

    return { attendance: student.attendanceEvents };
};

const getNotes = async function(parentUId, studentId) {
    const parent = await Parent.findOne({ userId: parentUId });
    const student = await Student.findOne({ _id: studentId });

    if(parent === null || student === null || !parent.children.includes(student._id))
        return Boom.badRequest();

    let decorator = student.notes.map(async n => {
        const teacher = await Teacher.findOne({ _id: n.teacherId }).populate('userId');
        return { _id: n._id, date: n.date, description: n.description, teacher: [teacher.userId.name, teacher.userId.surname].join(' ') };
    });
    const teacherDecoratedNotes = await Promise.all(decorator);

    return { notes: teacherDecoratedNotes };
};

const getStudents = async function(classId) {
    const filter = classId !== null ? { classId } : {};
    const students = await Student.find(filter, { 'grades._id': 0 });
    return { students };
};

const getClasses = async function() {
    let classes = await SchoolClass.find();
    const teachers = await Teacher.find().populate('userId');

    const timetableInfo = teachers.flatMap(t => {
        const teacherInfo = { _id: t._id, ssn: t.userId.ssn, surname: t.userId.surname, name: t.userId.name };
        return t.timetable.map(w => {
            return { weekhour: w.weekhour, subject: w.subject, classId: w.classId, teacher: teacherInfo };
        });
    });
    classes = classes.map(c => {
        const timetable = timetableInfo.filter(w => w.classId.equals(c._id));
        return { _id: c._id, name: c.name, timetable };
    });

    return { classes };
};

const recordGrades = async function(teacherUId, subject, date, description, grades) {
    const teacher = await Teacher.findOne({ userId: teacherUId });
    const students = await Student.find({ _id: { $in: grades.map(g => g.studentId) }});
    const schoolClassesIds = students.reduce((arr, x) => {
        if(!arr.some(i => i.equals(x.classId))) arr.push(x.classId);
        return arr;
    }, []);

    if(teacher === null || students.length != grades.length || schoolClassesIds.length !== 1)
        return Boom.badRequest();

    const actualDate = new Date(date.getTime() - date.getTime() % (60*60*1000));

    if(actualDate > Date.now())
        return Boom.badRequest();

    if(!teacher.timetable.some(t => (t.classId.equals(schoolClassesIds[0]) && t.subject === subject && HLib.weekhourToDate(t.weekhour).getTime() === actualDate.getTime())))
        return Boom.badRequest();

    students.forEach(s => s.grades.push({ value: grades.find(g => g.studentId === s._id.toString()).grade, subject, description, date: actualDate }));
    await Promise.all(students.map(s => s.save()));

    return {success: true};
};

const recordAttendance = async function(teacherUId, classId, info) {
    const teacher = await Teacher.findOne({ userId: teacherUId });
    const students = await Student.find({ _id: { $in: info.map(i => i.studentId) }});

    if(teacher === null || students.length != info.length || !students.every(s => s.classId.toString() === classId))
        return Boom.badRequest();

    const whs = teacher.timetable.filter(t => t.classId.toString() === classId && HLib.weekhourToDate(t.weekhour).isSameDayOf(new Date(Date.now()))).map(t => t.weekhour);

    if(whs.length === 0 || info.some(i => i.time !== null && (!i.time.isTimeIncludedInWeekhours(whs) || !i.time.isTimeValidFor(i.attendanceEvent))))
        return Boom.badRequest();

    students.forEach(s => {
        let sInfo = info.find(i => i.studentId === s._id.toString());
        s.attendanceEvents = s.attendanceEvents.filter(ae => ae.event !== sInfo.attendanceEvent || !ae.date.isSameDayOf(new Date(Date.now())));
        if(sInfo.time !== null)
            s.attendanceEvents.push({ date: HLib.timeToDate(sInfo.time), event: sInfo.attendanceEvent });
    });
    await Promise.all(students.map(s => s.save()));

    return { success: true };
};

const recordNote = async function(teacherUId, studentId, description) {
    const teacher = await Teacher.findOne({ userId: teacherUId });
    const student = await Student.findById(studentId);

    if(teacher === null || student === null)
        return Boom.badRequest();

    student.notes.push({
        teacherId: teacher._id,
        description
    });
    await student.save();

    return { success: true };
};

const addStudent = async function(ssn,
                                  name,
                                  surname,
                                  parentOneName,
                                  parentOneSurname,
                                  parentOneSsn,
                                  parentOneEmail,
                                  parentTwoName,
                                  parentTwoSurname,
                                  parentTwoSsn,
                                  parentTwoEmail) {
    const newStudent = new Student({ ssn, name, surname });
    await newStudent.save();

    // Parent one creation
    let existingUser = await User.findOne({ parentOneEmail });
    if (existingUser === null) {
        const password = HLib.getRandomPassword();
        const parentOneUser = new User({
            ssn: parentOneSsn,
            name: parentOneName,
            surname: parentOneSurname,
            mail: parentOneEmail,
            password,
            scope: ['parent'],
            firstLogin: true
        });
        await parentOneUser.save();
        const parentOne = new Parent({ userId: parentOneUser._id, children: [newStudent._id] });
        await parentOne.save();
    } else {
        // TODO Add child to found parent
    }

    // Parent two creation
    existingUser = await User.findOne({ parentTwoEmail });
    if (existingUser === null) {
        const password = HLib.getRandomPassword();
        const parentTwoUser = new User({
            ssn: parentTwoSsn,
            name: parentTwoName,
            surname: parentTwoSurname,
            mail: parentTwoEmail,
            password,
            scope: ['parent'],
            firstLogin: true
        });
        await parentTwoUser.save();
        const parentTwo = new Parent({ userId: parentTwoUser._id, children: [newStudent._id] });
        await parentTwo.save();
    } else {
        // TODO Add child to found parent
    }

    return {success: true};
};

const addSchoolClass = async function(name, students) {
    const schoolClass = await SchoolClass.findOneAndUpdate({ name: name.toUpperCase() }, {}, { new: true, upsert: true });
    await Student.updateMany({ classId: schoolClass._id }, { classId: undefined });
    await Student.updateMany({ _id: { $in: students } }, { classId: schoolClass._id });

    return { success: true };
};

module.exports = {
    getTeachers,
    getGrades,
    getTermGrades,
    getAttendance,
    getNotes,
    getStudents,
    getClasses,
    recordGrades,
    recordAttendance,
    recordNote,
    addStudent,
    addSchoolClass
};