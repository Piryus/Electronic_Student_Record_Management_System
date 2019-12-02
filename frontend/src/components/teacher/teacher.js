import HLib from '@emarkk/hlib/index';
import React from 'react';
import styles from './styles.module.css';
import {Container, Row, Nav} from 'react-bootstrap';
import {FaGraduationCap, FaMedal, FaBook, FaCalendarCheck, FaArrowAltCircleLeft} from 'react-icons/fa'
import LectureTopics from './lecture-topics';
import StudentGradesSummary from './student-grades-summary/studentGradesSummary';
import Assignments from './assignments/assignments';
import AppNavbar from "../utils/navbar/navbar";
import Rollcall from './rollcall/rollcall';
import EarlyLateRecordComponenent from '../utils/earlyLateRecordComponent/index';

export default class Teacher extends React.Component {

    constructor(props) {
        super(props);

        let subjects = [];
        this.props.timetable.forEach((value) =>{
            subjects[value.subject] = {
                subject: value.subject,
                class: value.classId.toString()
            };
        });
        const now = new Date(Date.now()).getNormalizedDay();

        let hours_classes = []; 
        this.props.timetable.forEach(t => {
            if(t.weekhour.split('_')[0] === now.toString()){
                hours_classes.push(            {
                    hour: t.weekhour.split('_')[1],
                    classId: t.classId
                });
            }
        });

        this.state = {
            userRequest: 'lecture',
            classes: [],
            classSelected: '',
            students: [],
            subjects: subjects,
            classesHours: hours_classes,
            classAttendance: [],
            now: now
        };
        this.updateClassAttendanceHandler = this.updateClassAttendanceHandler.bind(this);
    }

    async updateClassAttendanceHandler(){
        if(this.state.classesHours.length !== 0){
            await this.getStudentAttendances();
        }
    }

    async componentDidMount(){
            //Load all students
            await this.getAllStudents();
            let classes = await this.getClasses();
            this.setState({
            classes: classes,
            classSelected: classes[0]
            });
            if(this.state.classesHours.length !== 0){
                await this.getStudentAttendances();
            }
    }



    async getStudentAttendances(){
        try{
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

            let attendance = json.attendance[this.state.classSelected.classId];
            
            this.setState({classAttendance: attendance});
        } catch(e){
            alert(e);
        }
    }

    async getAllStudents(){
        try{
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
            this.setState({
                students: json.students,
            });
        } catch (e) {
            alert(e);
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
        let classes = [];
        this.state.classesHours.forEach(ch =>{
            let found = json.classes.find(jc => ch.classId === jc._id);
            if(found !== undefined){
                classes.push(
                    {
                        classId: found._id,
                        name: found.name
                    }
                );
            }
        });
        return classes;
    };


    setUserRequest(e, choice) {
        this.setState({userRequest: choice});
    }

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
                                onClick={(e) => this.setUserRequest(e, "lecture")}><FaGraduationCap/> Lecture
                                topics</Nav.Link>
                            <Nav.Link
                                className={this.state.userRequest === 'grades' ? styles.sidebarLinkActive : styles.sidebarLink}
                                onClick={(e) => this.setUserRequest(e, "grades")}><FaMedal/> Student grades</Nav.Link>
                            <Nav.Link
                                className={this.state.userRequest === 'assignments' ? styles.sidebarLinkActive : styles.sidebarLink}
                                onClick={(e) => this.setUserRequest(e, "assignments")}><FaBook/> Assignments </Nav.Link>
                            {this.state.classesHours.find(ch => ch.hour === '0')  && (
                            <Nav.Link className={this.state.userRequest === 'rollcall' ? styles.sidebarLinkActive : styles.sidebarLink} onClick={(e) => this.setUserRequest(e, "rollcall")}><FaCalendarCheck/> Rollcall </Nav.Link>
                            )}
                            {this.state.classesHours.length > 0 && (
                                <Nav.Link className={this.state.userRequest === 'early-late' ? styles.sidebarLinkActive : styles.sidebarLink} onClick={(e) => this.setUserRequest(e, "early-late")}><FaArrowAltCircleLeft/> Late-Entrance/Early-Exit </Nav.Link>
                            )}
                        </Nav>
                        <main className={"col-md-9 ml-sm-auto col-lg-10 px-4 pt-5"}>
                            {this.state.userRequest === 'lecture' && (<LectureTopics timetable={this.props.timetable.reduce((obj, x) => {
                                obj[x.weekhour] = { name: x.subject, active: HLib.weekhourToDate(x.weekhour) < now };
                                return obj;
                            }, {})}/>)}
                             {this.state.userRequest === 'grades' && (
                                <StudentGradesSummary students={this.state.students} subjects={this.state.subjects} timetable={this.props.timetable} type='teacher-grades'/>
                            )}
                            {this.state.userRequest === 'assignments' && (
                                <Assignments subjects={this.state.subjects} timetable={this.props.timetable}/>
                            )}
                            {this.state.userRequest === 'rollcall' &&(
                                <Rollcall classAttendance={this.state.classAttendance} classId={this.state.classesHours.find(ch => ch.hour === '0').classId}  updateClassAttendanceOnParent={this.updateClassAttendanceHandler}/>
                            )}
                            {this.state.userRequest === 'early-late' && this.state.classesHours.find(ch => ch.hour === '0' || ch.hour === '1') !== undefined && (
                                <EarlyLateRecordComponenent type={'late-entrance'} classId={this.state.classSelected.classId} timetable={this.props.timetable} now={this.state.now}/>
                            )}
                            {this.state.userRequest === 'early-late' && this.state.classesHours.length > 0 && (
                                <EarlyLateRecordComponenent type={'early-exit'} classId={this.state.classSelected.classId} timetable={this.props.timetable} now={this.state.now}/>
                            )}
                        </main>
                    </Row>
                </Container>
            </div>
        );
    }
}