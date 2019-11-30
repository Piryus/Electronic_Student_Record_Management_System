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
        const now = new Date().getDay() -1  ; //DISABLE for development purpose
        //const now = 4; //DEVELOPMENT PURPOSE
        var classId = this.props.timetable.find(t => t.weekhour === now.toString()+'_'+0);
        var workingHour = '';
        if(classId === undefined){
            //I'm not working in the first hour
            classId = this.props.timetable.find(t => t.weekhour === now.toString()+'_'+1);
            if(classId === undefined){
                //I'm not working in the second hour
                let index = 2;

                for( ; index<6 ; index++){
                    classId = this.props.timetable.find(t => t.weekhour === now.toString()+'_'+index);
                    if(classId !== undefined){
                        workingHour = index;
                        classId = classId.classId
                        break;
                    }
                }
                if(index === 6){
                    classId = '';

                }
            } else {
                workingHour = 1;
                classId = classId.classId;
            }
        } else {
            workingHour = 0;
            classId= classId.classId;
        }


        this.state = {
            userRequest: 'lecture',
            students: [],
            subjects: subjects,
            classId: classId,
            workingHour: workingHour,
            classAttendance: [],
            now: now
        };
        this.updateClassAttendanceHandler = this.updateClassAttendanceHandler.bind(this);
    }

    async updateClassAttendanceHandler(){
        if(this.state.classId !== ''){
            await this.getStudentAttendances();
        }
    }

    async componentDidMount(){
            //Load all students
            await this.getAllStudents();
            if(this.state.classId !== ''){
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
            
            this.setState({classAttendance: json.classAttendance});
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



    setUserRequest(e, choice) {
        this.setState({userRequest: choice});
    }

    render() {
        const now = new Date();
        return (
            <div className={styles.root}>
                <AppNavbar type='classic' onLogout={() => this.props.onLogout()} onHamburgerMenu={() => this.setState({sidebarOpen: !this.state.sidebarOpen})}/>
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
                            {parseInt(this.state.workingHour) === 0  && (
                            <Nav.Link className={this.state.userRequest === 'rollcall' ? styles.sidebarLinkActive : styles.sidebarLink} onClick={(e) => this.setUserRequest(e, "rollcall")}><FaCalendarCheck/> Rollcall </Nav.Link>
                            )}
                            {this.state.classId !== '' && (
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
                                <Rollcall classAttendance={this.state.classAttendance} classId={this.state.classId} workingHour={this.state.workingHour} updateClassAttendanceOnParent={this.updateClassAttendanceHandler}/>
                            )}
                            {this.state.userRequest === 'early-late' && this.state.workingHour <= 1 && (
                                <EarlyLateRecordComponenent type={'late-entrance'} classId={this.state.classId} timetable={this.props.timetable} now={this.state.now}/>
                            )}
                            {this.state.userRequest === 'early-late' && this.state.workingHour > -1 && (
                                <EarlyLateRecordComponenent type={'early-exit'} classId={this.state.classId} timetable={this.props.timetable} now={this.state.now}/>
                            )}
                        </main>
                    </Row>
                </Container>
            </div>
        );
    }
}