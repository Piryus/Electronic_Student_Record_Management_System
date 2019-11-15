import React from 'react';
import Grades from './grades/grades';
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

export default class Parent extends React.Component {

    constructor(props) {
        super(props);
        // Select first child
        const childSelected = props.children[0];

        this.state = {
            userRequest: '',
            childSelected: childSelected,
            children: props.children,
            childGrades: null
        };
        this.setUserRequest = this.setUserRequest.bind(this);
    }

    async componentDidMount() {
        await this.getChildGrades(this.state.childSelected);
    }

    async getChildGrades(childSelected) {
        // Query child's grades
        const url = 'http://localhost:3000/grades/' + childSelected._id;
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

    selectChild = (e) => {
        this.setState({
            childSelected: e.target.value,
            userRequest: ''
        });
    };

    setUserRequest(e, choice) {
        this.setState({userRequest: choice});
    }

    render() {
        /*const old = {
            <div className={styles.body}>
                <div>
                    <div className={styles.header}>
                        <h1>Parent section</h1>
                    </div>

                    <div className={styles.selectorWrapper}>
                        <select className={styles.childSelector} onChange={(e) => this.selectChild(e)}>
                            {this.state.children.map(this.renderChildItem)}
                        </select>
                    </div>

                    <div>
                        <table className={styles.panel}>
                            <tr>
                                <td>
                                    <button onClick={(e) => this.setUserRequest(e, "grades")} className={styles.link}>
                                        <div className={styles.panelElement}>
                                            <p>Grades</p>
                                        </div>
                                    </button>
                                </td>
                            </tr>
                            <tr>
                            </tr>
                        </table>

                        {this.state.userRequest === 'grades' && (
                            <Grades childId={this.state.childSelected}/>
                        )}
                    </div>
                </div>
            </div>}*/

        const selectedChildId = this.state.childSelected._id;
        let childNotSelected = [];
        this.state.children.map((child) => {
            if (child._id !== selectedChildId)
                childNotSelected.push(<Dropdown.Item key={child._id} href="#">{child.name}</Dropdown.Item>);
        });

        // TODO Sort the grades into topics and create the DOM elements
        // let gradesSortedTopic;
        // let gradesDOM;
        // if (this.state.childGrades !== null) {
        //     this.state.childGrades.map((grade) => {
        //
        //     });
        // }
        // console.log(this.state.childGrades);

        return (
            <div className={styles.root}>
                <Navbar fixed="top" bg="dark" className={["navbar-dark shadow flex-md-nowrap", styles.navbar]}>
                    <Navbar.Brand>SE2</Navbar.Brand>
                    <Dropdown className={'ml-auto'}>
                        <Dropdown.Toggle id="dropdown-basic">
                            {this.state.childSelected.name}
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                            {childNotSelected.map((child) => {
                                return child
                            })}
                        </Dropdown.Menu>
                    </Dropdown>
                </Navbar>
                <Container fluid>
                    <Row>
                        <Nav defaultActiveKey="/home"
                             className={["flex-column bg-light col-md-2 d-none d-md-block", styles.sidebar]}>
                            <Nav.Link className={styles.sidebarLink} href="/"><FaGraduationCap/> Grades</Nav.Link>
                            <Nav.Link className={styles.sidebarLink} eventKey="link-1"><FaCog/> Settings</Nav.Link>
                        </Nav>
                        <main className={[styles.mainContainer, "col-md-9 ml-sm-auto col-lg-10 px-4 pt-5"]}>
                            <h2>Grades</h2>
                            <Accordion className={styles.gradesContainer} defaultActiveKey="0">
                                <Card>
                                    <Card.Header>
                                        <Accordion.Toggle as={Button} variant="link" eventKey="0">
                                            Maths
                                        </Accordion.Toggle>
                                    </Card.Header>
                                    <Accordion.Collapse eventKey="0">
                                        <Card.Body>Grade 1:....</Card.Body>
                                    </Accordion.Collapse>
                                </Card>
                                <Card>
                                    <Card.Header>
                                        <Accordion.Toggle as={Button} variant="link" eventKey="1">
                                            English
                                        </Accordion.Toggle>
                                    </Card.Header>
                                    <Accordion.Collapse eventKey="1">
                                        <Card.Body>Grades...</Card.Body>
                                    </Accordion.Collapse>
                                </Card>
                            </Accordion>
                        </main>
                    </Row>
                </Container>
            </div>
        );
    }
}