import React from 'react';
import styles from './styles.module.css';
import {Container, Row, Nav, Navbar, Button} from 'react-bootstrap';
import {FaGraduationCap, FaCog} from 'react-icons/fa'
import LectureTopics from './lecture-topics';
import StudentGradesSummary from './student-grades-summary/studentGradesSummary';
import lib from '../../lib';
import AppNavbar from "../navbar/navbar";

export default class Teacher extends React.Component {



    constructor(props) {
        super(props);

        let subjects = [];
        this.props.timetable.forEach((value) =>{
            subjects[value.subject] = value.subject;
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
                            <Nav.Link className={this.state.userRequest === 'grades' ? styles.sidebarLinkActive : styles.sidebarLink} onClick={(e) => this.setUserRequest(e, "grades")}><FaGraduationCap/> Student Grades</Nav.Link>
                            <Nav.Link className={this.state.userRequest === 'settings' ? styles.sidebarLinkActive : styles.sidebarLink} onClick={(e) => this.setUserRequest(e, "settings")} ><FaCog/> Settings</Nav.Link>
                        </Nav>
                        <main className={[styles.mainContainer, "col-md-9 ml-sm-auto col-lg-10 px-4 pt-5"]}>
                            {this.state.userRequest === 'lecture' && (<LectureTopics timetable={this.props.timetable.reduce((obj, x) => {
                                obj[x.weekhour] = { name: x.subject, active: lib.weekhourToDate(x.weekhour) < now };
                                return obj;
                            }, {})}/>)}
                             {this.state.userRequest === 'grades' && (
                                <StudentGradesSummary students={this.state.students} subjects={this.state.subjects} type='teacher-grades'/>
                            )}
                        </main>
                    </Row>
                </Container>
            </div>
        );
    }
}