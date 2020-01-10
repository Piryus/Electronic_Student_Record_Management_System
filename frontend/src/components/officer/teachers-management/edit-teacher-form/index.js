import React from 'react';
import {Alert, Button, Form, Modal} from "react-bootstrap";

export default class EditTeacherModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            id: '',
            email: '',
            name: '',
            surname: '',
            ssn: '',
            error: ''
        };
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if(nextProps.teacher.id !== prevState.id){
            return {
                id: nextProps.teacher.id,
                email: nextProps.teacher.mail,
                name: nextProps.teacher.name,
                surname: nextProps.teacher.surname,
                ssn: nextProps.teacher.ssn,
                error: ''
            };
        }
        else return null;
    }

    async handleSubmitForm() {
        try {
            const url = 'http://localhost:3000/users/' + this.state.id;
            const options = {
                method: 'PATCH',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({
                    mail: this.state.email,
                    name: this.state.name,
                    surname: this.state.surname,
                    ssn: this.state.ssn
                })
            };
            const response = await fetch(url, options);
            const responseJson = await response.json();
            if (responseJson.success) {
                this.props.handleClose(true);
            } else {
                this.setState({error: 'Unable to update this user.'});
            }
        } catch (e) {
            this.setState({error: 'Unable to update this user.'});
        }
    };

    render() {
        const {teacher} = this.props;
        return (
            <Modal show={this.props.show} onHide={() => this.props.onClose()}>
                <Modal.Header closeButton>
                    <Modal.Title>Modify {teacher.name} {teacher.surname}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {this.state.error !== "" &&(
                        <Alert variant='danger'>{this.state.error}</Alert>
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
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="success" onClick={() => this.handleSubmitForm()}>Update teacher data</Button>
                    <Button variant="danger" onClick={() => this.props.onClose()}>Cancel</Button>
                </Modal.Footer>
            </Modal>
        );
    }
}