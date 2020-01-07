import React from "react";
import {Alert, Button, Col, Form, Modal, Row} from "react-bootstrap";
import {FaAngleLeft, FaAngleRight} from "react-icons/fa";

export default class NewAppointmentModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            error: '',
            selectedChild: '',
            focusWeekBeginDay: new Date()
        }
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
                                          value={this.state.selectedChild}
                                          onChange={(e) => this.setState({selectedChild: e.target.value})}>
                                <option>Julia</option>
                                <option>Marco</option>
                                <option>Pierro</option>
                            </Form.Control>
                        </Form.Group>
                        <Form.Group controlId="formChild">
                            <Form.Label>Teacher:</Form.Label>
                            <Form.Control as="select"
                                          value={this.state.selectedTeacher}
                                          onChange={(e) => this.setState({selectedTeacher: e.target.value})}>
                                <option>Marco Rosso</option>
                                <option>Teacher Five</option>
                                <option>Teacher Three</option>
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