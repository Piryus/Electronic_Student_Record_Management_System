import React from 'react';
import {Container, Card, Button, Accordion} from "react-bootstrap";
import NewClassModal from "./new-class-modal/new-class-modal";
import SectionHeader from "../../utils/section-header";

class Classes extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            showNewClassModal: false,
            students: [],
            classes: []
        }
    }

    async componentDidMount() {
        const students = await this.getAllStudents();
        const classes = await this.getClasses();
        this.setState({
            students: students,
            classes: classes,
        });
    }

    async getClasses() {
        const url = 'http://localhost:3000/classes';
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
        return json.classes;
    };

    async getAllStudents() {
        const url = 'http://localhost:3000/students';
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
        return json.students;
    }

    render() {
        return (
            <Container fluid>
                <SectionHeader>Classes</SectionHeader>
                <Button onClick={() => this.setState({showNewClassModal: true})} className="mb-2">Create a
                    class</Button>
                <NewClassModal show={this.state.showNewClassModal}
                               handleClose={() => this.setState({showNewClassModal: false})}
                               students={this.state.students}/>
                <Accordion>
                    {
                        this.state.classes.map((class_) => {
                            let studentIndex = 0;
                            return (
                                <Card key={class_._id}>
                                    <Accordion.Toggle as={Card.Header} eventKey={class_._id}>
                                        {class_.name}
                                    </Accordion.Toggle>
                                    {this.state.students.map((student) => {
                                        if (student.classId === class_._id) {
                                            studentIndex++;
                                            return (
                                                <Accordion.Collapse eventKey={class_._id} key={student._id}>
                                                    <Card.Body>Student {studentIndex}: {student.surname} {student.name} SSN: {student.ssn} </Card.Body>
                                                </Accordion.Collapse>
                                            );
                                        }
                                    })}
                                </Card>)
                        })
                    }
                    <Card key={'no_class'}>
                        <Accordion.Toggle as={Card.Header} eventKey={'no_class'}>
                            Students without assigned class
                        </Accordion.Toggle>
                        {this.state.students.map((student) => {
                            if (student.classId === undefined || student.classId === null) {
                                return (
                                    <Accordion.Collapse eventKey={'no_class'} key={student._id}>
                                        <Card.Body>{student.surname} {student.name} SSN: {student.ssn} </Card.Body>
                                    </Accordion.Collapse>
                                );
                            }
                        })}
                    </Card>
                </Accordion>
            </Container>
        );
    }
}

export default Classes;