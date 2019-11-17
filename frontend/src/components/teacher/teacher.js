import React from 'react';
import styles from './styles.module.css';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Nav from 'react-bootstrap/Nav';
import Navbar from "react-bootstrap/Navbar";
import Dropdown from "react-bootstrap/Dropdown";
import Accordion from "react-bootstrap/Accordion";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import {FaGraduationCap, FaCog} from 'react-icons/fa'

import LectureTopics from './lecture-topics';

import lib from '../../lib';

export default class Teacher extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
        };
    }

    render() {
        const now = new Date();

        return (
            <div className={styles.root}>
                <Navbar fixed="top" bg="dark" className={["navbar-dark shadow flex-md-nowrap", styles.navbar]}>
                    <Navbar.Brand>SE2</Navbar.Brand>
                    <a className="btn btn-primary bg-danger border-danger ml-auto" href="/logout" role="button">Logout</a>
                </Navbar>
                <Container fluid>
                    <Row>
                        <Nav defaultActiveKey="/home" className={["flex-column bg-light col-md-2 d-none d-md-block", styles.sidebar]}>
                            <Nav.Link className={styles.sidebarLink} href="/"><FaGraduationCap/> Lecture Topics</Nav.Link>
                            <Nav.Link className={styles.sidebarLink} eventKey="link-1"><FaCog/> Settings</Nav.Link>
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