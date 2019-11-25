import React from 'react';
import styles from './styles.module.css';
import {Container, Nav, Row} from 'react-bootstrap';
import {FaBook, FaCog, FaGraduationCap, FaMedal} from 'react-icons/fa'
import LectureTopics from './lecture-topics';
import StudentGradesSummary from './student-grades-summary/studentGradesSummary';
import Assignments from './assignments/assignments';
import lib from '../../lib';
import AppNavbar from "../common-components/navbar/navbar";

export default class Teacher extends React.Component {


    constructor(props) {
        super(props);

        let subjects = [];
        this.props.timetable.forEach((value) => {
            subjects[value.subject] = value.subject;
        });


        this.state = {
            userRequest: 'lecture',
            students: [],
            subjects: subjects,
        };
    }

    async componentDidMount() {
        //Load all students
        await this.getAllStudents();
    }

    async getAllStudents() {
        try {
            const url = 'http://localhost:3000/students/all';
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
                            <Nav.Link
                                className={this.state.userRequest === 'settings' ? styles.sidebarLinkActive : styles.sidebarLink}
                                onClick={(e) => this.setUserRequest(e, "settings")}><FaCog/> Settings</Nav.Link>
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
                        </main>
                    </Row>
                </Container>
            </div>
        );
    }
}