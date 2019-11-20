import React from 'react';
import styles from './styles.module.css';
import {Container, Row, Nav, Navbar, Button} from 'react-bootstrap';
import {FaGraduationCap, FaCog} from 'react-icons/fa'
import LectureTopics from './lecture-topics';
import lib from '../../lib';
import AppNavbar from "../navbar/navbar";

export default class Teacher extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            userRequest: 'lecture',
        };
    }

    setUserRequest(e, choice) {
        this.setState({userRequest: choice});
    }

    render() {
        const now = new Date();

        return (
            <div className={styles.root}>
                <AppNavbar type='classic' onLogout={() => this.props.onLogout()} />
                <Container fluid>
                    <Row>
                        <Nav className={["flex-column bg-light col-md-2 d-none d-md-block", styles.sidebar]}>
                            <Nav.Link className={this.state.userRequest === 'lecture' ? styles.sidebarLinkActive : styles.sidebarLink} onClick={(e) => this.setUserRequest(e, "lecture")}><FaGraduationCap/> Lecture Topics</Nav.Link>
                            <Nav.Link className={this.state.userRequest === 'settings' ? styles.sidebarLinkActive : styles.sidebarLink} onClick={(e) => this.setUserRequest(e, "settings")} ><FaCog/> Settings</Nav.Link>
                        </Nav>
                        <main className={[styles.mainContainer, "col-md-9 ml-sm-auto col-lg-10 px-4 pt-5"]}>
                            <LectureTopics timetable={this.props.timetable.reduce((obj, x) => {
                                obj[x.weekhour] = { name: x.subject, active: lib.weekhourToDate(x.weekhour) < now };
                                return obj;
                            }, {})} />
                        </main>
                    </Row>
                </Container>
            </div>
        );
    }
}