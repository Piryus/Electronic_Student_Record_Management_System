import React from 'react';
import styles from './styles.module.css';
import {Container, Nav, Row} from 'react-bootstrap';
import Classes from './classes/classes';
import EnrolmentForm from './enrolment-form/officer-enrolment-form';
import {FaCalendarAlt, FaLayerGroup, FaRegNewspaper, FaUserEdit} from 'react-icons/fa';
import AppNavbar from "../utils/navbar/navbar";
import News from "../utils/news";
import TimetablesManager from "./timetables";
import ParentAccess from "./parent-access";
import TeachersManagement from "./teachers-management";

export default class Officer extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            userRequest: 'news',
            sidebarOpen: false,
        };
    }

    setUserRequest(e, choice) {
        this.setState({userRequest: choice});
    }

    render() {
        return (
            <div className={styles.root}>
                <AppNavbar type='classic' onLogout={() => this.props.onLogout()}
                           onHamburgerMenu={() => this.setState({sidebarOpen: !this.state.sidebarOpen})}/>
                <Container fluid>
                    <Row>
                        <Nav
                            className={[this.state.sidebarOpen ? 'bg-light col-5' : 'd-none', "flex-column bg-light col-md-2 d-md-block", styles.sidebar]}>
                            <Nav.Link
                                className={this.state.userRequest === 'news' ? styles.sidebarLinkActive : styles.sidebarLink}
                                onClick={(e) => this.setUserRequest(e, "news")}><FaRegNewspaper/> News</Nav.Link>
                            <Nav.Link
                                className={this.state.userRequest === 'accounts' ? styles.sidebarLinkActive : styles.sidebarLink}
                                onClick={(e) => this.setUserRequest(e, "accounts")}><FaUserEdit/> Parents</Nav.Link>
                            <Nav.Link
                                className={this.state.userRequest === 'enrollStudent' ? styles.sidebarLinkActive : styles.sidebarLink}
                                onClick={(e) => this.setUserRequest(e, "enrollStudent")}><FaUserEdit/> Students</Nav.Link>
                            <Nav.Link
                                className={this.state.userRequest === 'teachers' ? styles.sidebarLinkActive : styles.sidebarLink}
                                onClick={(e) => this.setUserRequest(e, "teachers")}><FaUserEdit/> Teachers</Nav.Link>
                            <Nav.Link
                                className={this.state.userRequest === 'classes' ? styles.sidebarLinkActive : styles.sidebarLink}
                                onClick={(e) => this.setUserRequest(e, "classes")}><FaLayerGroup/> Classes</Nav.Link>
                            <Nav.Link
                                className={this.state.userRequest === 'timetables' ? styles.sidebarLinkActive : styles.sidebarLink}
                                onClick={(e) => this.setUserRequest(e, "timetables")}><FaCalendarAlt/> Timetables</Nav.Link>
                        </Nav>
                        <main className={"col-md-10 ml-sm-auto col-lg-10 px-4 pt-5"}>
                            {this.state.userRequest === 'accounts' && (
                                <ParentAccess/>
                            )}
                            {this.state.userRequest === 'classes' && (
                                <Classes/>
                            )}
                            {this.state.userRequest === 'enrollStudent' && (
                                <EnrolmentForm/>
                            )}
                            {this.state.userRequest === 'news' && (
                                <News isOfficer/>
                            )}
                            {this.state.userRequest === 'timetables' && (
                                <TimetablesManager/>
                            )}
                            {this.state.userRequest === 'teachers' && (
                                <TeachersManagement/>
                            )}
                        </main>
                    </Row>
                </Container>
            </div>
        );
    }
}