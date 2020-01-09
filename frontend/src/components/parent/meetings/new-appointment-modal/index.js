import React from "react";
import {Alert, Button, Col, Form, Modal, Row} from "react-bootstrap";
import {FaAngleLeft, FaAngleRight} from "react-icons/fa";
import moment from "moment";
import LoadingSpinner from "../../../utils/loading-spinner";


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
            teacherSlots: [],
            displayedSlots: [],
            focusDay: new Date(),
            isLoading: true
        }
    }

    async componentDidMount() {
        const children = await this.fetchChildren();
        const defaultTeachers = await this.fetchChildTeachers(children[0].id);
        let teacherSlots = await this.fetchTeacherSlots(defaultTeachers[0].id);
        const defaultTeacherSlots = teacherSlots.filter(slot => {
            return moment(slot.date).isSame(this.state.focusDay, 'day');
        });
        this.setState({
            children,
            selectedChild: children[0],
            teachers: defaultTeachers,
            selectedTeacher: defaultTeachers[0],
            teacherSlots: teacherSlots,
            displayedSlots: defaultTeacherSlots,
            isLoading: false
        });
    }

    async changeDay(next) {
        let newDay = this.state.focusDay;
        if (next === 1) {
            newDay = moment(this.state.focusDay).add(1, 'd');
        } else if (next === -1 && moment(this.state.focusDay).isAfter(new Date(), 'day')) {
            newDay = moment(this.state.focusDay).add(-1, 'd');
        }
        const teacherSlots = this.state.teacherSlots.filter(slot => {
            return moment(slot.date).isSame(newDay, 'day');
        });
        this.setState({
            focusDay: newDay,
            displayedSlots: teacherSlots
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
        return json.slots.sort((slot1, slot2) => new Date(slot1.date) - new Date(slot2.date));
    }

    async selectChild(childId) {
        const child = this.state.children.find(child => child.id === childId);
        const teachers = await this.fetchChildTeachers(childId);
        let teacherSlots = await this.fetchTeacherSlots(teachers[0].id);
        const defaultTeacherSlots = teacherSlots.filter(slot => {
            return moment(slot.date).isSame(this.state.focusDay, 'day');
        });
        this.setState({
            selectedChild: child,
            teachers,
            selectedTeacher: teachers[0],
            teacherSlots,
            displayedSlots: defaultTeacherSlots
        });
    }

    async selectTeacher(teacherId) {
        const teacher = this.state.teachers.find(teacher => teacher.id === teacherId);
        let teacherSlots = await this.fetchTeacherSlots(teacherId);
        const defaultTeacherSlots = teacherSlots.filter(slot => {
            return moment(slot.date).isSame(this.state.focusDay, 'day');
        });
        this.setState({
            selectedTeacher: teacher,
            teacherSlots,
            displayedSlots: defaultTeacherSlots
        });
    }

    render() {
        return (
            <Modal show={this.props.show} onHide={() => this.props.onClose()}>
                <Modal.Header closeButton>
                    <Modal.Title>Book a new appointment</Modal.Title>
                </Modal.Header>
                {this.state.isLoading && <div className="mt-5 mb-5"><LoadingSpinner/></div>}
                {!this.state.isLoading &&
                <>
                    <Modal.Body>
                        {this.state.error !== '' && (
                            <Alert variant='danger'>{this.state.error}</Alert>
                        )}
                        <Form>
                            <Form.Group controlId="formChild">
                                <Form.Label>Child:</Form.Label>
                                <Form.Control as="select"
                                              value={this.state.selectedChild.id}
                                              onChange={async (e) => this.selectChild(e.target.value)}>
                                    {this.state.children.map(child => <option value={child.id}
                                                                              key={child.id}>{child.name} {child.surname}</option>)}
                                </Form.Control>
                            </Form.Group>
                            <Form.Group controlId="formChild">
                                <Form.Label>Teacher:</Form.Label>
                                <Form.Control as="select"
                                              value={this.state.selectedTeacher.id}
                                              onChange={async (e) => await this.selectTeacher(e.target.value)}>
                                    {this.state.teachers.map(teacher => <option value={teacher.id}
                                                                                key={teacher.id}>{teacher.name} {teacher.surname}</option>)}
                                </Form.Control>
                            </Form.Group>
                            <Row className="justify-content-center mb-2">
                                <Col xs="auto">
                                    <Button onClick={async () => await this.changeDay(-1)}
                                            disabled={!moment(this.state.focusDay).isAfter(Date.now(), 'day')}>
                                        <FaAngleLeft/>
                                    </Button>
                                </Col>
                                <Col
                                    xs="auto align-self-center"><b>{moment(this.state.focusDay).format('dddd D MMMM')}</b></Col>
                                <Col xs="auto"><Button
                                    onClick={async () => await this.changeDay(1)}><FaAngleRight/></Button></Col>
                            </Row>
                            <Row>
                                {this.state.displayedSlots.map((slot, index) =>
                                    <Col xs={4} key={index} className="d-flex justify-content-center">
                                        <Form.Check inline label={moment(slot.date).format('HH:mm')} type="radio"/>
                                    </Col>
                                )}
                                {this.state.displayedSlots.length === 0 &&
                                <Col className="text-center">There isn't any available slot on this day.</Col>
                                }
                            </Row>
                        </Form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="success" onClick={() => this.handleSubmitForm()}>Book</Button>
                        <Button variant="danger" onClick={() => this.props.onClose()}>Cancel</Button>
                    </Modal.Footer>
                </>
                }
            </Modal>
        );
    }
}