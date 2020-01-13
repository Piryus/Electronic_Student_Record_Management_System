import React from 'react';
import styles from './styles.module.css';
import {Container, Nav, Row} from 'react-bootstrap';
import {FaAddressCard, FaBook, FaExclamationTriangle, FaGraduationCap, FaRegNewspaper, FaFilePdf, FaClock, FaHandshake, FaHandPaper, FaCalendarAlt} from 'react-icons/fa';
import AppNavbar from '../utils/navbar/navbar';
import Grades from "./grades/parent-grades";
import Assignments from './assignments';
import Attendance from './attendance/';
import News from "../utils/news";
import Notes from "./notes";
import Material from "./material/material";
import Meetings from "./meetings";
import ParentFinalGrades from './final-grades';
import ParentLectureTopics from './topics';
import ChildTimetable from "./child-timetable";

export default class Parent extends React.Component {

    constructor(props) {
        super(props);
        // Select first child
        const childSelected = props.children[0];

        this.state = {
            userRequest: 'news',
            childSelected: childSelected,
            children: props.children
        };
    }

    selectChild(child) {
        this.setState({
            childSelected: child,
            sidebarOpen: false,
        });
    };

    setUserRequest(e, choice) {
        this.setState({userRequest: choice});
    }

    render() {
        return (
            <div className={styles.root}>
                <AppNavbar type='parent'
                           children={this.state.children}
                           selectedChild={this.state.childSelected}
                           childSelection={(child) => this.selectChild(child)}
                           onLogout={() => this.props.onLogout()}
                           onHamburgerMenu={() => this.setState({sidebarOpen: !this.state.sidebarOpen})}/>
                <Container fluid>
                    <Row>
                        <Nav
                            className={[this.state.sidebarOpen ? 'bg-light col-5' : 'd-none', "flex-column bg-light col-md-2 d-md-block", styles.sidebar]}>
                            <Nav.Link
                                className={this.state.userRequest === 'news' ? styles.sidebarLinkActive : styles.sidebarLink}
                                onClick={(e) => this.setUserRequest(e, "news")}><FaRegNewspaper/> News</Nav.Link>
                            <Nav.Link
                                className={this.state.userRequest === 'timetable' ? styles.sidebarLinkActive : styles.sidebarLink}
                                onClick={(e) => this.setUserRequest(e, "timetable")}><FaCalendarAlt/> Timetable</Nav.Link>
                            <Nav.Link
                                className={this.state.userRequest === 'topics' ? styles.sidebarLinkActive : styles.sidebarLink}
                                onClick={() => this.setState({userRequest: "topics"})}><FaHandPaper/> Lecture topics </Nav.Link>
                            <Nav.Link
                                className={this.state.userRequest === 'grades' ? styles.sidebarLinkActive : styles.sidebarLink}
                                onClick={(e) => this.setUserRequest(e, "grades")}><FaGraduationCap/> Grades</Nav.Link>
                            <Nav.Link
                                className={this.state.userRequest === 'final-grades' ? styles.sidebarLinkActive : styles.sidebarLink}
                                onClick={() => this.setState({userRequest: "final-grades"})}><FaClock/> Final grades 
                                of the term</Nav.Link>
                            <Nav.Link
                                className={this.state.userRequest === 'assignments' ? styles.sidebarLinkActive : styles.sidebarLink}
                                onClick={(e) => this.setUserRequest(e, "assignments")}><FaBook/> Assignments</Nav.Link>
                            <Nav.Link
                                className={this.state.userRequest === 'attendance' ? styles.sidebarLinkActive : styles.sidebarLink}
                                onClick={(e) => this.setUserRequest(e, "attendance")}><FaAddressCard/> Attendance</Nav.Link>
                            <Nav.Link
                                className={this.state.userRequest === 'notes' ? styles.sidebarLinkActive : styles.sidebarLink}
                                onClick={() => this.setState({userRequest: "notes"})}><FaExclamationTriangle/> Notes
                                from teachers</Nav.Link>
                            <Nav.Link
                                className={this.state.userRequest === 'material' ? styles.sidebarLinkActive : styles.sidebarLink}
                                onClick={() => this.setState({userRequest: "material"})}><FaFilePdf/> Support
                                material</Nav.Link>
                            <Nav.Link
                                className={this.state.userRequest === 'meetings' ? styles.sidebarLinkActive : styles.sidebarLink}
                                onClick={() => this.setState({userRequest: "meetings"})}><FaHandshake/> Meetings with
                                teachers</Nav.Link>
                        </Nav>
                        <main className="col-md-10 ml-sm-auto col-lg-10 px-4 pt-5">
                            {this.state.userRequest === 'news' && (
                                <News/>
                            )}
                            {this.state.userRequest === 'grades' && (
                                <Grades child={this.state.childSelected}/>
                            )}
                            {this.state.userRequest === 'assignments' && (
                                <Assignments child={this.state.childSelected}/>
                            )}
                            {this.state.userRequest === 'attendance' && (
                                <Attendance child={this.state.childSelected}/>
                            )}
                            {this.state.userRequest === 'notes' && (
                                <Notes child={this.state.childSelected}/>
                            )}
                            {this.state.userRequest === 'material' && (
                                <Material child={this.state.childSelected}/>
                            )}
                            {this.state.userRequest === 'meetings' && (
                                <Meetings child={this.state.childSelected}/>
                            )}
                            {this.state.userRequest === 'final-grades' &&(
                                <ParentFinalGrades child={this.state.childSelected}/>
                            )}
                            {this.state.userRequest === 'timetable' && (
                                <ChildTimetable child={this.state.childSelected}/>
                            )}
                            {this.state.userRequest === 'topics' &&(
                                <ParentLectureTopics child={this.state.childSelected}/>
                            )}
                        </main>
                    </Row>
                </Container>
            </div>
        );
    }
}