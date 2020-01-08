import React from "react";
import {Alert, Button, Col, Form, Modal, Row} from "react-bootstrap";
import {FaAngleLeft, FaAngleRight} from "react-icons/fa";
import moment from "moment";


export default class NewAppointmentModal extends React.Component {
    constructor(props) {
        super(props);
        moment.locale('en-US');
        this.state = {
            error: '',
            children: [],
            selectedChild: null,
            teachers: [],
            selectedTeacher: null,
            slots: [],
            focusDay: new Date()
        }
    }

    async componentDidMount() {
        const children = await this.fetchChildren();
        const defaultTeachers = await this.fetchChildTeachers(children[0].id);
        let defaultTeacherSlots = await this.fetchTeacherSlots(defaultTeachers[0].id);
        defaultTeacherSlots = defaultTeacherSlots.filter(slot => {
           return moment(slot.date).isSame(this.state.focusDay, 'day');
        });
        this.setState({
            children,
            selectedChild: children[0],
            teachers: defaultTeachers,
            selectedTeacher: defaultTeachers[0],
            slots: defaultTeacherSlots
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

    async fetchTeacherSlots(teacherId) {
        const url = `http://localhost:3000/meetings/${teacherId}/slots`;
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
        return json.slots;
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
                            <Col xs="auto align-self-center"><b>{moment(this.state.focusDay).format('dddd D MMMM')}</b></Col>
                            <Col xs="auto"><Button onClick={() => this.changeWeek(1)}><FaAngleRight/></Button></Col>
                        </Row>
                        <Row>
                            {this.state.slots.map((slot, index) =>
                                <Col xs={6} key={index}>
                                    <Form.Check inline label={moment(slot.date).format('HH:mm')} type="radio"/>
                                </Col>
                            )}
                            {this.state.slots.length === 0 &&
                            <Col className="text-center">There isn't any available slot on this day.</Col>
                            }
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