import HLib from '@emarkk/hlib/index';
import React from 'react';
import styles from './styles.module.css';
import {Container, Nav, Row} from 'react-bootstrap';
import {FaArrowAltCircleLeft, FaBook, FaCalendarCheck, FaGraduationCap, FaMedal} from 'react-icons/fa'
import LectureTopics from './lecture-topics';
import StudentGradesSummary from './student-grades-summary/studentGradesSummary';
import Assignments from './assignments/assignments';
import AppNavbar from "../utils/navbar/navbar";
import Rollcall from './rollcall/rollcall';
import EarlyLateRecordComponenent from '../utils/earlyLateRecordComponent/index';

export default class Teacher extends React.Component {

    constructor(props) {
        super(props);

        // Create an array containing the teacher's classes of the day
        const todayDayNumber = new Date(Date.now()).getNormalizedDay();
        const classes = this.props.timetable.reduce((classes, class_) => {
            if (class_.weekhour.split('_')[0] === todayDayNumber.toString()) {
                classes.push({
                    hour: class_.weekhour.split('_')[1],
                    classId: class_.classId
                });
            }
            return classes;
        }, []);

        let subjects = [];
        this.props.timetable.forEach((value) => {
            subjects[value.subject] = {
                subject: value.subject,
                class: value.classId.toString()
            };
        });

        this.state = {
            userRequest: 'lecture',
            classes: [],
            classSelected: '',
            students: [],
            subjects: subjects,
            classesHours: classes,
            classAttendance: [],
            now: todayDayNumber
        };
    }

    updateClassAttendanceHandler = async () => {
        if (this.state.classesHours.length !== 0) {
            await this.getStudentAttendances();
        }
    };

    async componentDidMount() {
        const students = await this.getAllStudents();
        const classes = await this.getClasses();
        const attendance = this.state.classesHours.length !== 0 ? await this.getStudentAttendances() : [];
        this.setState({
            students: students,
            classes: classes,
            classSelected: classes[0],
            classAttendance: attendance
        });
    }


    async getStudentAttendances() {
        try {
            const url = 'http://localhost:3000/attendance';
            const options = {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
            };
            let response = await fetch(url, options);
            const json = await response.json();
            return json.attendance;
        } catch (e) {
            console.log(e);
        }
    }

    async getAllStudents() {
        try {
            const url = 'http://localhost:3000/students';
            const options = {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
            };
            let response = await fetch(url, options);
            const json = await response.json();
            return json.students;
        } catch (e) {
            console.log(e);
        }
    }

    selectClass(c) {
        this.setState({
            classSelected: c,
            sidebarOpen: false,
        });
    };

    async getClasses() {
        const url = 'http://localhost:3000/classes';
        const options = {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            credentials: 'include',
        };
        let response = await fetch(url, options);
        const json = await response.json();
        return json.classes.filter(class_ => {
            return this.state.classesHours.find(classHour => classHour.classId === class_._id) !== undefined;
        });
    };

    render() {
        const now = new Date(Date.now());
        return (
            <div className={styles.root}>
                <AppNavbar
                    type={this.state.userRequest === 'early-late' ? 'teacher' : 'classic'}
                    onLogout={() => this.props.onLogout()}
                    onHamburgerMenu={() => this.setState({sidebarOpen: !this.state.sidebarOpen})}
                    classes={this.state.classes}
                    classSelection={(c) => this.selectClass(c)}
                    selectedClass={this.state.classSelected}
                />
                <Container fluid>
                    <Row>
                        <Nav
                            className={[this.state.sidebarOpen ? 'bg-light col-5' : 'd-none', "flex-column bg-light col-md-2 d-md-block", styles.sidebar]}>
                            <Nav.Link
                                className={this.state.userRequest === 'lecture' ? styles.sidebarLinkActive : styles.sidebarLink}
                                onClick={() => this.setState({userRequest: "lecture"})}><FaGraduationCap/> Lectures</Nav.Link>
                            <Nav.Link
                                className={this.state.userRequest === 'grades' ? styles.sidebarLinkActive : styles.sidebarLink}
                                onClick={() => this.setState({userRequest: "grades"})}><FaMedal/> Grades</Nav.Link>
                            <Nav.Link
                                className={this.state.userRequest === 'assignments' ? styles.sidebarLinkActive : styles.sidebarLink}
                                onClick={() => this.setState({userRequest: "assignments"})}><FaBook/> Assignments</Nav.Link>
                            {this.state.classesHours.find(ch => ch.hour === '0') && (
                                <Nav.Link
                                    className={this.state.userRequest === 'rollcall' ? styles.sidebarLinkActive : styles.sidebarLink}
                                    onClick={() => this.setState({userRequest: "rollcall"})}><FaCalendarCheck/> Roll
                                    call</Nav.Link>
                            )}
                            {this.state.classesHours.length > 0 && (
                                <Nav.Link
                                    className={this.state.userRequest === 'early-late' ? styles.sidebarLinkActive : styles.sidebarLink}
                                    onClick={() => this.setState({userRequest: "early-late"})}><FaArrowAltCircleLeft/> Students
                                    attendance</Nav.Link>
                            )}
                        </Nav>
                        <main className={"col-md-9 ml-sm-auto col-lg-10 px-4 pt-5"}>
                            {this.state.userRequest === 'lecture' && (
                                <LectureTopics timetable={this.props.timetable.reduce((obj, x) => {
                                    obj[x.weekhour] = {name: x.subject, active: HLib.weekhourToDate(x.weekhour) < now};
                                    return obj;
                                }, {})}/>)}
                            {this.state.userRequest === 'grades' && (
                                <StudentGradesSummary students={this.state.students} subjects={this.state.subjects}
                                                      timetable={this.props.timetable} type='teacher-grades'/>
                            )}
                            {this.state.userRequest === 'assignments' && (
                                <Assignments subjects={this.state.subjects} timetable={this.props.timetable}/>
                            )}
                            {this.state.userRequest === 'rollcall' && (
                                <Rollcall classAttendance={this.state.classAttendance[this.state.classSelected.classId]}
                                          classId={this.state.classesHours.find(ch => ch.hour === '0').classId}
                                          updateClassAttendanceOnParent={this.updateClassAttendanceHandler}/>
                            )}
                            {this.state.userRequest === 'early-late' && this.state.classesHours.find(ch => ch.hour === '0' || ch.hour === '1') !== undefined && (
                                <EarlyLateRecordComponenent type={'late-entrance'}
                                                            classId={this.state.classSelected.classId}
                                                            timetable={this.props.timetable} now={this.state.now}/>
                            )}
                            {this.state.userRequest === 'early-late' && this.state.classesHours.length > 0 && (
                                <EarlyLateRecordComponenent type={'early-exit'}
                                                            classId={this.state.classSelected.classId}
                                                            timetable={this.props.timetable} now={this.state.now}/>
                            )}
                        </main>
                    </Row>
                </Container>
            </div>
        );
    }
}