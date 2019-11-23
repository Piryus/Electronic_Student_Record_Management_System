import React from 'react';
import {Alert, Button, Form, Modal} from "react-bootstrap";
import Select from "react-select";

export default class NewUserForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            name: '',
            surname: '',
            ssn: '',
            role: 'teacher', // WARNING: This is a little hack, this value should be changed if the first option in the role dropdown is changed
            error: false,
        };
    }

    async handleSubmitForm() {
        const url = 'http://localhost:3000/users/add';
        const options = {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({
                mail: this.state.email,
                name: this.state.name,
                surname: this.state.surname,
                ssn: this.state.ssn,
                scope: this.state.role
            })
        };
        const response = await fetch(url, options);
        const responseJson = await response.json();
        if (responseJson.success) {
            this.props.handleClose(true);
        } else {
            this.setState({error: true});
        }
    };

    render() {
        return (
            <Modal show={this.props.show} onHide={this.props.handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Add a new user</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {this.state.error &&(
                        <Alert variant='danger'>Unable to create this new user.</Alert>
                    )}
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
                        <Form.Group controlId="formRole">
                            <Form.Label>Role:</Form.Label>
                            <Form.Control as="select"
                                          type="string"
                                          value={this.state.role}
                                          onChange={(e) => this.setState({role: e.target.value.toLowerCase()})}>
                                <option>Teacher</option>
                                <option>Officer</option>
                            </Form.Control>
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