import React from 'react';
import {Alert, Badge, Button, Form, Modal} from "react-bootstrap";
import Select from "react-select";

export default class NewClassModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            className: '',
            studentsClass: [],
            error: '',
        };
    }

    computeSearchOptions() {
        return this.props.students.map((student) => {
            return {
                value: student,
                label: student.name + ' ' + student.surname + ' <' + student.ssn + '>'
            };
        });
    }

    addStudent(student) {
        let students = this.state.studentsClass;
        if (!students.includes(student)) {
            students.push(student);
            this.setState({
                studentsClass: students
            });
        }
    }

    async createClass() {
        if (this.state.className === '') {
            this.setState({error: 'Incorrect class name!'})
        } else if (this.state.studentsClass.length === 0) {
            this.setState({error: 'A class can\'t be empty!'});
        } else {
            await this.pushClassToDB();
        }
    }

    async pushClassToDB() {
        const url = 'http://localhost:3000/classes';
        let studentIds = this.state.studentsClass.map((student) => student._id);
        const jsonToSend = JSON.stringify({
            name: this.state.className,
            studentIds
        });
        const options = {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: jsonToSend
        };
        let response = await fetch(url, options);
        const json = await response.json();
        if (json.error != null) {
            alert('Error! Please insert a class Name');
        }
    }

    render() {
        const searchOptions = this.computeSearchOptions();
        return (
            <Modal show={this.props.show} onHide={this.props.handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Create a new class</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        {this.state.error !== '' && (
                            <Alert variant='danger'>{this.state.error}</Alert>
                        )}
                        <Form.Group controlId="formBasicEmail">
                            <Form.Label>Class name</Form.Label>
                            <Form.Control type="text" placeholder="Class names examples: 1A, 1B, 3C, 5B"
                                          onChange={(e) => this.setState({className: e.target.value})}/>
                            <Form.Text className="text-muted">
                                Class name must contain a number from 1 to 5 and an alphabet letter.
                            </Form.Text>
                        </Form.Group>
                        <hr/>
                        <Form.Group>
                            <Form.Label>Students</Form.Label>
                            <Select
                                value={''}
                                className='mb-1'
                                options={searchOptions}
                                onChange={(selectedStudent) => this.addStudent(selectedStudent.value)}
                            />
                            <div>
                            {this.state.studentsClass.map((student) =>
                                <Badge variant="secondary" className="mr-1"
                                       key={student._id}>{[student.surname, student.name].join(' ')}</Badge>
                            )}
                            </div>
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="success" onClick={() => this.createClass()}>Create class</Button>
                    <Button variant="danger" onClick={this.props.handleClose}>Cancel</Button>
                </Modal.Footer>
            </Modal>
        );
    }
}