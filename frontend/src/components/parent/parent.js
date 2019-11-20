import React from 'react';
import styles from './styles.module.css';
import {Container, Row, Nav, Button, Dropdown, Card, Accordion} from 'react-bootstrap';
import {FaGraduationCap, FaCog} from 'react-icons/fa';
import AppNavbar from '../navbar/navbar';

export default class Parent extends React.Component {

    constructor(props) {
        super(props);
        // Select first child
        const childSelected = props.children[0];

        this.state = {
            userRequest: 'grades',
            childSelected: childSelected,
            children: props.children,
            childGrades: null
        };
    }

    async componentDidMount() {
        await this.getChildGrades();
    }

    async componentWillUpdate() {
        await this.getChildGrades();
    }

    async getChildGrades() {
        // Query child's grades
        const url = 'http://localhost:3000/grades/' + this.state.childSelected._id;
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
            childGrades: json.grades
        });
    }

    selectChild(child) {
        this.setState({
            childSelected: child,
            userRequest: 'grades'
        });
    };

    setUserRequest(e, choice) {
        this.setState({userRequest: choice});
    }

    render() {
        //Building of Grades and Subejects DOM
        let gradesSortedTopic = [];
        let gradesDOM = [];
        if (this.state.childGrades !== null) {
            this.state.childGrades.map((grade) => {
                if (gradesSortedTopic[grade.subject] == null) {
                    gradesSortedTopic[grade.subject] = [];
                }
                let date = grade.date.split("T");
                gradesSortedTopic[grade.subject].push(
                    <Accordion.Collapse eventKey={grade.subject}>
                        <Card.Body>Grade {gradesSortedTopic[grade.subject].length + 1}: {grade.value} Date
                            : {date[0]}</Card.Body>
                    </Accordion.Collapse>
                );
            });
            let index;
            for (index in gradesSortedTopic) {
                gradesDOM.push(
                    <Card>
                        <Card.Header>
                            <Accordion.Toggle as={Button} variant="link" eventKey={index}>
                                {index}
                            </Accordion.Toggle>
                        </Card.Header>
                        {gradesSortedTopic[index].map((grade) => {
                            return grade;
                        })}
                    </Card>
                );
            }
        }

        return (
            <div className={styles.root}>
                <AppNavbar type='parent'
                    children={this.state.children}
                    selectedChild={this.state.childSelected}
                    childSelection={(child) => this.selectChild(child)}
                    onLogout={() => this.props.onLogout()}/>
                <Container fluid>
                    <Row>
                        <Nav className={["flex-column bg-light col-md-2 d-none d-md-block", styles.sidebar]}>
                            <Nav.Link
                                className={this.state.userRequest === 'grades' ? styles.sidebarLinkActive : styles.sidebarLink}
                                onClick={(e) => this.setUserRequest(e, "grades")}><FaGraduationCap/> Grades</Nav.Link>
                            <Nav.Link
                                className={this.state.userRequest === 'settings' ? styles.sidebarLinkActive : styles.sidebarLink}><FaCog/> Settings</Nav.Link>
                        </Nav>
                        <main className={[styles.mainContainer, "col-md-9 ml-sm-auto col-lg-10 px-4 pt-5"]}>
                            <h2>Grades</h2>
                            <Accordion className={styles.gradesContainer} defaultActiveKey="0">
                                {gradesDOM.map((subject) => {
                                    return subject;
                                })}
                            </Accordion>
                        </main>
                    </Row>
                </Container>
            </div>
        );
    }
}