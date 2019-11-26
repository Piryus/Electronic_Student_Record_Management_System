import React from 'react';
import styles from './styles.module.css';
import {Container, Row, Nav, Navbar, Button} from 'react-bootstrap';
import {FaGraduationCap, FaCog, FaMedal, FaBook, FaCalendarCheck} from 'react-icons/fa'
import LectureTopics from './lecture-topics';
import StudentGradesSummary from './student-grades-summary/studentGradesSummary';
import Assignments from './assignments/assignments';
import Attendances from './attendances/attendances';
import utils from '../../../../../hlib/utils';
import AppNavbar from "../common-components/navbar/navbar";

import utils from '../../../../../hlib/utils';

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
        //const now = this.dateToWeekhour(new Date(Date.now())); //DISABLE for development purpose
        const now = "0_1"; //ENABLE for development purpose
        const classId = this.props.timetable.find(t => t.weekhour === now);


        this.state = {
            userRequest: 'lecture',
            students: [],
            isTeacherWorking: false,
            subjects: subjects,
            classId: classId.classId,
            classAttendance: []
        };
    }

    async componentDidMount(){
            //Load all students
            await this.getAllStudents();
            await this.getStudentAttendances();
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
            
            if(json.classAttendance === undefined){
                this.setState({isTeacherWorking: false});
            }
            else{
                this.setState({
                    classAttendance: json.classAttendance,
                    isTeacherWorking: true
                });
            }
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


    dateToWeekhour = function(d) {

        const hour = 60 * 60 * 1000;
        const day = 24 * hour;
        const startHour = 8; 
        const numHours = 6;

        // saturday (6) and sunday (0) have to be excluded
        if([0, 6].includes(d.getDay()) || d.getHours() < startHour || d.getHours() > (startHour + numHours - 1))
            return null;
    
        const weekdayIndex = d.getDay() - 1;
        const hourIndex = d.getHours() - startHour;
        return weekdayIndex + '_' + hourIndex;
    };



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
                            <Nav.Link className={this.state.userRequest === 'attendances' ? styles.sidebarLinkActive : styles.sidebarLink} onClick={(e) => this.setUserRequest(e, "attendances")}><FaCalendarCheck/> Attendances </Nav.Link>
                        </Nav>
                        <main className={"col-md-10 ml-sm-auto col-lg-10 px-4 pt-5"}>
                            {this.state.userRequest === 'lecture' && (
                                <LectureTopics timetable={this.props.timetable.reduce((obj, x) => {
                                    obj[x.weekhour] = {name: x.subject, active: lib.weekhourToDate(x.weekhour) < now};
                                    return obj;
                                }, {})}/>)}
                            {this.state.userRequest === 'grades' && (
                                <StudentGradesSummary students={this.state.students} subjects={this.state.subjects}
                                                      type='teacher-grades'/>
                            )}
                            {this.state.userRequest === 'assignments' && (
                                <Assignments subjects={this.state.subjects} timetable={this.props.timetable}/>
                            )}
                            {this.state.userRequest === 'attendances' && this.state.isTeacherWorking === true &&(
                                <Attendances classAttendance={this.state.classAttendance} classId={this.state.classId}/>
                            )}
                        </main>
                    </Row>
                </Container>
            </div>
        );
    }
}