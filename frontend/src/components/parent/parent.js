import React from 'react';
import styles from './styles.module.css';
import {Container, Row, Nav, Navbar, Button, Dropdown, Card, Accordion} from 'react-bootstrap';
import {FaGraduationCap, FaCog} from 'react-icons/fa'

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
        this.setUserRequest = this.setUserRequest.bind(this);
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

    selectChild = (e, id) => {
        let index = 0;
        let childIndex = 0;
        this.state.children.forEach((c) => {
            if(c._id === id){
                childIndex = index;
            }
            index++;
        });
        this.setState({
            childSelected: this.state.children[childIndex],
            userRequest: 'grades'
        });
    };

    setUserRequest(e, choice) {
        this.setState({userRequest: choice});
    }

    render() {
        const selectedChildId = this.state.childSelected._id;
        let childNotSelected = [];
        this.state.children.map((child) => {
            if (child._id !== selectedChildId)
                childNotSelected.push(<Dropdown.Item key={child._id} href="#" onClick={(e) => this.selectChild(e, child._id)}>{[child.name, child.surname].join(' ')}</Dropdown.Item>);
        });

        //Building of Grades and Subejects DOM
        let gradesSortedTopic = [];
        let gradesDOM = [];
        if (this.state.childGrades !== null) {
            this.state.childGrades.map((grade) => {
                if(gradesSortedTopic[grade.subject] == null){
                    gradesSortedTopic[grade.subject] = [];
                }
                let date = grade.date.split("T");
                gradesSortedTopic[grade.subject].push(
                <Accordion.Collapse eventKey={grade.subject}>
                    <Card.Body>Grade {gradesSortedTopic[grade.subject].length+1}: {grade.value} Date : {date[0]}</Card.Body>
                </Accordion.Collapse>
                );
            });
            let index;
            for(index in gradesSortedTopic){
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
                <Navbar fixed="top" bg="dark" className={["navbar-dark shadow flex-md-nowrap", styles.navbar]}>
                    <Navbar.Brand>SE2</Navbar.Brand>
                    <Dropdown className={'ml-auto'}>
                        <Dropdown.Toggle id="dropdown-basic">
                            {[this.state.childSelected.name, this.state.childSelected.surname].join(' ')}&nbsp;
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                            {childNotSelected.map((child) => {
                                return child
                            })}
                        </Dropdown.Menu>
                    </Dropdown>
                    <Button onClick={() => this.props.onLogout()} variant='danger' className="ml-2" role="button">Logout</Button>
                </Navbar>
                <Container fluid>
                    <Row>
                        <Nav className={["flex-column bg-light col-md-2 d-none d-md-block", styles.sidebar]}>
                            <Nav.Link className={this.state.userRequest === 'grades' ? styles.sidebarLinkActive : styles.sidebarLink} onClick={(e) => this.setUserRequest(e, "grades")}><FaGraduationCap/> Grades</Nav.Link>
                            <Nav.Link className={this.state.userRequest === 'settings' ? styles.sidebarLinkActive : styles.sidebarLink}><FaCog/> Settings</Nav.Link>
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