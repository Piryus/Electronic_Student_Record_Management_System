import React from 'react';
import styles from './styles.module.css';
import {Container, Row, Nav} from 'react-bootstrap';
import {FaGraduationCap, FaCog, FaRegNewspaper, FaBook, FaAddressCard} from 'react-icons/fa';
import AppNavbar from '../utils/navbar/navbar';
import Grades from "./grades/parent-grades";
import Assignments from './assignments';
import Attendance from './attendance/';
import News from "../utils/news";

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
                        <Nav className={[this.state.sidebarOpen ? 'bg-light col-5':'d-none', "flex-column bg-light col-md-2 d-md-block", styles.sidebar]}>
                            <Nav.Link
                                className={this.state.userRequest === 'news' ? styles.sidebarLinkActive : styles.sidebarLink}
                                onClick={(e) => this.setUserRequest(e, "news")}><FaRegNewspaper/> News</Nav.Link>
                            <Nav.Link
                                className={this.state.userRequest === 'grades' ? styles.sidebarLinkActive : styles.sidebarLink}
                                onClick={(e) => this.setUserRequest(e, "grades")}><FaGraduationCap/> Grades</Nav.Link>
                            <Nav.Link
                                className={this.state.userRequest === 'assignments' ? styles.sidebarLinkActive : styles.sidebarLink}
                                onClick={(e) => this.setUserRequest(e, "assignments")}><FaBook/> Assignments</Nav.Link>
                            <Nav.Link
                                className={this.state.userRequest === 'attendance' ? styles.sidebarLinkActive : styles.sidebarLink}
                                onClick={(e) => this.setUserRequest(e, "attendance")}><FaAddressCard/> Attendance</Nav.Link>
                            <Nav.Link
                                className={this.state.userRequest === 'settings' ? styles.sidebarLinkActive : styles.sidebarLink}><FaCog/> Settings</Nav.Link>
                        </Nav>
                        <main className="col-md-10 ml-sm-auto col-lg-10 px-4 pt-5">
                            {this.state.userRequest === 'news' && (
                                <News />
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
                        </main>
                    </Row>
                </Container>
            </div>
        );
    }
}