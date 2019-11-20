import React from 'react';
import styles from './styles.module.css';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Nav from 'react-bootstrap/Nav';
import Navbar from "react-bootstrap/Navbar";
import ParentAccountEnabling from './parent-access/officer-parent-access';
import Classes from './classes/classes';
import EnrolmentForm from './enrolment-form/officer-enrolment-form';
import {FaUserEdit, FaLayerGroup, FaCog, FaGraduationCap} from 'react-icons/fa';
import Button from "react-bootstrap/Button";
import AppNavbar from "../navbar/navbar";

export default class Officer extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            userRequest: 'grades',
        };
        this.setUserRequest = this.setUserRequest.bind(this);
    }

    setUserRequest(e, choice) {
        this.setState({userRequest: choice});
    }

    render() {
        return (
            <div className={styles.root}>
                <AppNavbar type='classic' onLogout={() => this.props.onLogout()} />
                <Container fluid>
                    <Row>
                        <Nav className={["flex-column bg-light col-md-2 d-none d-md-block", styles.sidebar]}>
                            <Nav.Link className={this.state.userRequest === 'accounts' ? styles.sidebarLinkActive : styles.sidebarLink} onClick={(e) => this.setUserRequest(e, "accounts")}><FaUserEdit/> Accounts</Nav.Link>
                            <Nav.Link className={this.state.userRequest === 'classes' ? styles.sidebarLinkActive : styles.sidebarLink} onClick={(e) => this.setUserRequest(e, "classes")}><FaLayerGroup/> Classes</Nav.Link>
                            <Nav.Link className={this.state.userRequest === 'enrollStudent' ? styles.sidebarLinkActive : styles.sidebarLink} onClick={(e) => this.setUserRequest(e, "enrollStudent")}><FaGraduationCap/> Students</Nav.Link>
                            <Nav.Link className={this.state.userRequest === 'settings' ? styles.sidebarLinkActive : styles.sidebarLink}><FaCog/> Settings</Nav.Link>
                        </Nav>
                        <main className={[styles.mainContainer, "col-md-9 ml-sm-auto col-lg-10 px-4 pt-5"]}>
                                {this.state.userRequest === 'accounts' &&(
                                    <ParentAccountEnabling/>
                                )}
                                {this.state.userRequest === 'classes' &&(
                                    <Classes/>
                                )}
                                {this.state.userRequest === 'enrollStudent' &&(
                                    <EnrolmentForm/>
                                )}
                        </main>
                    </Row>
                </Container>
            </div>
        );
    }
}