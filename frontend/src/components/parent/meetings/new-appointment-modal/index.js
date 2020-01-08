import React from "react";
import {Alert, Button, Col, Form, Modal, Row} from "react-bootstrap";
import {FaAngleLeft, FaAngleRight} from "react-icons/fa";


export default class NewAppointmentModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            error: '',
            children: [],
            selectedChild: null,
            teachers: [],
            selectedTeacher: null,
            focusWeekBeginDay: new Date()
        }
    }

    async componentDidMount() {
        const children = await this.fetchChildren();
        const defaultTeachers = await this.fetchChildTeachers(children[0].id);
        this.setState({
            children,
            selectedChild: children[0],
            teachers: defaultTeachers,
            selectedTeacher: defaultTeachers[0]
        });
    }

    async fetchChildren() {
        const url = 'http://localhost:3000/children';
        const options = {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            credentials: 'include'
        };
        const response = await fetch(url, options);
        const json = await response.json();
        return json.children;
    }

    async fetchChildTeachers(childId) {
        const url = `http://localhost:3000/teachers/${childId}`;
        const options = {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            credentials: 'include'
        };
        const response = await fetch(url, options);
        const json = await response.json();
        return json.teachers;
    }

    async selectChild(childId) {
        const child = this.state.children.find(child => child.id === childId);
        const teachers = await this.fetchChildTeachers(childId);
        this.setState({
            selectedChild: child,
            teachers,
            selectedTeacher: teachers[0]
        });
    }

    render() {
        return (
            <Modal show={this.props.show} onHide={() => this.props.onClose()}>
                <Modal.Header closeButton>
                    <Modal.Title>Book a new appointment</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {this.state.error !== '' &&(
                        <Alert variant='danger'>{this.state.error}</Alert>
                    )}
                    <Form>
                        <Form.Group controlId="formChild">
                            <Form.Label>Child:</Form.Label>
                            <Form.Control as="select"
                                          onChange={async (e) => this.selectChild(e.target.value)}>
                                {this.state.children.map(child => <option value={child.id} key={child.id}>{child.name} {child.surname}</option>)}
                            </Form.Control>
                        </Form.Group>
                        <Form.Group controlId="formChild">
                            <Form.Label>Teacher:</Form.Label>
                            <Form.Control as="select"
                                          onChange={(e) => this.setState({selectedTeacher: e.target.value})}>
                                {this.state.teachers.map(teacher => <option value={teacher} key={teacher._id}>{teacher.name} {teacher.surname}</option>)}
                            </Form.Control>
                        </Form.Group>
                        <Row className="justify-content-center mb-2">
                            <Col xs="auto"><Button onClick={() => this.changeWeek(-1)}><FaAngleLeft/></Button></Col>
                            <Col xs="auto align-self-center">6. January - 12. January</Col>
                            <Col xs="auto"><Button onClick={() => this.changeWeek(1)}><FaAngleRight/></Button></Col>
                        </Row>
                        <Row>
                            <Col xs={4}><Form.Check inline label="Jan. 12 15:00" type="radio"/></Col>
                            <Col xs={4}><Form.Check inline label="Jan. 12 15:00" type="radio"/></Col>
                            <Col xs={4}><Form.Check inline label="Jan. 12 15:00" type="radio"/></Col>
                            <Col xs={4}><Form.Check inline label="Jan. 12 15:00" type="radio"/></Col>
                            <Col xs={4}><Form.Check inline label="Jan. 12 15:00" type="radio"/></Col>
                            <Col xs={4}><Form.Check inline label="Jan. 12 15:00" type="radio"/></Col>
                            <Col xs={4}><Form.Check inline label="Jan. 12 15:00" type="radio"/></Col>
                            <Col xs={4}><Form.Check inline label="Jan. 12 15:00" type="radio"/></Col>
                            <Col xs={4}><Form.Check inline label="Jan. 12 15:00" type="radio"/></Col>
                            <Col xs={4}><Form.Check inline label="Jan. 12 15:00" type="radio"/></Col>
                            <Col xs={4}><Form.Check inline label="Jan. 12 15:00" type="radio"/></Col>
                            <Col xs={4}><Form.Check inline label="Jan. 12 15:00" type="radio"/></Col>
                            <Col xs={4}><Form.Check inline label="Jan. 12 15:00" type="radio"/></Col>
                            <Col xs={4}><Form.Check inline label="Jan. 12 15:00" type="radio"/></Col>
                            <Col xs={4}><Form.Check inline label="Jan. 12 15:00" type="radio"/></Col>
                            <Col xs={4}><Form.Check inline label="Jan. 12 15:00" type="radio"/></Col>
                            <Col xs={4}><Form.Check inline label="Jan. 12 15:00" type="radio"/></Col>
                            <Col xs={4}><Form.Check inline label="Jan. 12 15:00" type="radio"/></Col>
                            <Col xs={4}><Form.Check inline label="Jan. 12 15:00" type="radio"/></Col>
                            <Col xs={4}><Form.Check inline label="Jan. 12 15:00" type="radio"/></Col>
                            <Col xs={4}><Form.Check inline label="Jan. 12 15:00" type="radio"/></Col>
                            <Col xs={4}><Form.Check inline label="Jan. 12 15:00" type="radio"/></Col>
                            <Col xs={4}><Form.Check inline label="Jan. 12 15:00" type="radio"/></Col>
                            <Col xs={4}><Form.Check inline label="Jan. 12 15:00" type="radio"/></Col>
                            <Col xs={4}><Form.Check inline label="Jan. 12 15:00" type="radio"/></Col>
                            <Col xs={4}><Form.Check inline label="Jan. 12 15:00" type="radio"/></Col>
                            <Col xs={4}><Form.Check inline label="Jan. 12 15:00" type="radio"/></Col>
                            <Col xs={4}><Form.Check inline label="Jan. 12 15:00" type="radio"/></Col>
                            <Col xs={4}><Form.Check inline label="Jan. 12 15:00" type="radio"/></Col>
                            <Col xs={4}><Form.Check inline label="Jan. 12 15:00" type="radio"/></Col>
                            <Col xs={4}><Form.Check inline label="Jan. 12 15:00" type="radio"/></Col>
                            <Col xs={4}><Form.Check inline label="Jan. 12 15:00" type="radio"/></Col>
                            <Col xs={4}><Form.Check inline label="Jan. 12 15:00" type="radio"/></Col>
                            <Col xs={4}><Form.Check inline label="Jan. 12 15:00" type="radio"/></Col>
                            <Col xs={4}><Form.Check inline label="Jan. 12 15:00" type="radio"/></Col>
                        </Row>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="success" onClick={() => this.handleSubmitForm()}>Book</Button>
                    <Button variant="danger" onClick={() => this.props.onClose()}>Cancel</Button>
                </Modal.Footer>
            </Modal>
        );
    }
}