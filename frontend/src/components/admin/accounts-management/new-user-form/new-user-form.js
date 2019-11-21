import React from 'react';
import {Button, Form, Modal} from "react-bootstrap";
import Select from "react-select";

export default class NewUserForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            name: '',
            surname: '',
            ssn: ''
        };
    }

    handleSubmitForm() {
        // TODO Backend request to add the user
        this.props.handleClose();
    };

    render() {
        return (
            <Modal show={this.props.show} onHide={this.props.handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Add a new user</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group controlId="formEmail">
                            <Form.Label>Email:</Form.Label>
                            <Form.Control type="email"
                                          placeholder="Enter email"
                                          value={this.state.email}
                                          onChange={(e) => this.setState({email: e.target.value})}/>
                            <Form.Text className="text-muted">
                            </Form.Text>
                        </Form.Group>
                        <Form.Group controlId="formName">
                            <Form.Label>Name:</Form.Label>
                            <Form.Control type="string"
                                          placeholder="Enter name"
                                          value={this.state.name}
                                          onChange={(e) => this.setState({name: e.target.value})}/>
                            <Form.Text className="text-muted">
                            </Form.Text>
                        </Form.Group>
                        <Form.Group controlId="formSurname">
                            <Form.Label>Surname:</Form.Label>
                            <Form.Control type="string"
                                          placeholder="Enter name"
                                          value={this.state.surname}
                                          onChange={(e) => this.setState({surname: e.target.value})}/>
                            <Form.Text className="text-muted">
                            </Form.Text>
                        </Form.Group>
                        <Form.Group controlId="formSSN">
                            <Form.Label>SSN:</Form.Label>
                            <Form.Control type="string"
                                          placeholder="Enter SSN"
                                          value={this.state.ssn}
                                          onChange={(e) => this.setState({ssn: e.target.value})}/>
                            <Form.Text className="text-muted">
                            </Form.Text>
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="success" onClick={() => this.handleSubmitForm()}>Add user</Button>
                    <Button variant="danger" onClick={this.props.handleClose}>Cancel</Button>
                </Modal.Footer>
            </Modal>
        );
    }
}