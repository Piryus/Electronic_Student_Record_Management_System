import React from 'react';
import styles from './styles.module.css';
import {Button, Container, Nav, Row} from 'react-bootstrap';
import ParentAccountEnabling from './parent-access/officer-parent-access';
import Classes from './classes/classes';
import EnrolmentForm from './enrolment-form/officer-enrolment-form';
import {FaCog, FaGraduationCap, FaLayerGroup, FaRegNewspaper, FaUserEdit} from 'react-icons/fa';
import AppNavbar from "../common-components/navbar/navbar";
import News from "./news/officer-news";

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
                <AppNavbar type='classic' onLogout={() => this.props.onLogout()} onHamburgerMenu={() => this.setState({sidebarOpen: !this.state.sidebarOpen})}/>
                <Container fluid>
                    <Row>
                        <Nav className={[this.state.sidebarOpen ? 'bg-light col-5':'d-none', "flex-column bg-light col-md-2 d-md-block", styles.sidebar]}>
                            <Nav.Link
                                className={this.state.userRequest === 'news' ? styles.sidebarLinkActive : styles.sidebarLink}
                                onClick={(e) => this.setUserRequest(e, "news")}><FaRegNewspaper/> News</Nav.Link>
                            <Nav.Link
                                className={this.state.userRequest === 'accounts' ? styles.sidebarLinkActive : styles.sidebarLink}
                                onClick={(e) => this.setUserRequest(e, "accounts")}><FaUserEdit/> Accounts</Nav.Link>
                            <Nav.Link
                                className={this.state.userRequest === 'classes' ? styles.sidebarLinkActive : styles.sidebarLink}
                                onClick={(e) => this.setUserRequest(e, "classes")}><FaLayerGroup/> Classes</Nav.Link>
                            <Nav.Link
                                className={this.state.userRequest === 'enrollStudent' ? styles.sidebarLinkActive : styles.sidebarLink}
                                onClick={(e) => this.setUserRequest(e, "enrollStudent")}><FaGraduationCap/> Students</Nav.Link>
                            <Nav.Link
                                className={this.state.userRequest === 'settings' ? styles.sidebarLinkActive : styles.sidebarLink}><FaCog/> Settings</Nav.Link>
                        </Nav>
                        <main className={"col-md-10 ml-sm-auto col-lg-10 px-4 pt-5"}>
                            {this.state.userRequest === 'accounts' && (
                                <ParentAccountEnabling/>
                            )}
                            {this.state.userRequest === 'classes' && (
                                <Classes/>
                            )}
                            {this.state.userRequest === 'enrollStudent' && (
                                <EnrolmentForm/>
                            )}
                            {this.state.userRequest === 'news' && (
                                <News/>
                            )}
                        </main>
                    </Row>
                </Container>
            </div>
        );
    }
}