import React from 'react';
import styles from './styles.module.css';
import {Container, Row, Nav, Navbar, Button} from 'react-bootstrap';
import {FaGraduationCap, FaCog, FaMedal, FaBook} from 'react-icons/fa'
import LectureTopics from './lecture-topics';
import StudentGradesSummary from './student-grades-summary/studentGradesSummary';
import Assignments from './assignments/assignments';
import lib from '../../lib';
import AppNavbar from "../common-components/navbar/navbar";

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


        this.state = {
            userRequest: 'lecture',
            students: [],
            subjects: subjects,
        };
    }

    async componentDidMount(){
            //Load all students
            await this.getAllStudents();
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
        } catch(e){
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
                <AppNavbar type='classic' onLogout={() => this.props.onLogout()} />)}
                <Container fluid>
                    <Row>
                        <Nav className={["flex-column bg-light col-md-2 d-none d-md-block", styles.sidebar]}>
                            <Nav.Link className={this.state.userRequest === 'lecture' ? styles.sidebarLinkActive : styles.sidebarLink} onClick={(e) => this.setUserRequest(e, "lecture")}><FaGraduationCap/> Lecture Topics</Nav.Link>
                            <Nav.Link className={this.state.userRequest === 'grades' ? styles.sidebarLinkActive : styles.sidebarLink} onClick={(e) => this.setUserRequest(e, "grades")}><FaMedal/> Student Grades</Nav.Link>
                            <Nav.Link className={this.state.userRequest === 'assignments' ? styles.sidebarLinkActive : styles.sidebarLink} onClick={(e) => this.setUserRequest(e, "assignments")}><FaBook/> Assignments </Nav.Link>
                            <Nav.Link className={this.state.userRequest === 'settings' ? styles.sidebarLinkActive : styles.sidebarLink} onClick={(e) => this.setUserRequest(e, "settings")} ><FaCog/> Settings</Nav.Link>
                        </Nav>
                        <main className={"col-md-9 ml-sm-auto col-lg-10 px-4 pt-5"}>
                            {this.state.userRequest === 'lecture' && (<LectureTopics timetable={this.props.timetable.reduce((obj, x) => {
                                obj[x.weekhour] = { name: x.subject, active: lib.weekhourToDate(x.weekhour) < now };
                                return obj;
                            }, {})}/>)}
                             {this.state.userRequest === 'grades' && (
                                <StudentGradesSummary students={this.state.students} subjects={this.state.subjects} timetable={this.props.timetable} type='teacher-grades'/>
                            )}
                            {this.state.userRequest === 'assignments' &&(
                                <Assignments subjects={this.state.subjects} timetable={this.props.timetable}/>
                            )}
                        </main>
                    </Row>
                </Container>
            </div>
        );
    }
}