import React from "react";
import {Alert, Button, Container, Form, Modal} from "react-bootstrap";
import Select from "react-select";

export default class NewNoteForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedStudent: undefined,
            noteContent: '',
            error: ''
        };
    }

    async createNote() {
        if (this.state.noteContent === '') {
            this.setState({error: 'Note is empty!'})
        } else if (this.state.selectedStudent === undefined) {
            this.setState({error: 'You didn\'t select a student!'});
        } else {
            const response = await this.postNoteDb();
            if (response.success === true) {
                this.props.handleClose();
            } else {
                this.setState({error: 'The note couldn\'t be submitted. Please try again later.'});
            }
        }
    }

    async postNoteDb() {
        try {
            const url = 'http://localhost:3000/notes/' + this.state.selectedStudent.value._id;
            const options = {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    description: this.state.noteContent
                }),
                credentials: 'include',
            };
            const response = await fetch(url, options);
            return await response.json();
        } catch (e) {
            console.log(e);
        }
    }


    render() {
        return (
            <Modal show={this.props.show} onHide={this.props.handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Write a note to student's parents:</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {this.state.error !== '' && (
                        <Alert variant='danger'>{this.state.error}</Alert>
                    )}
                    <Form>
                        <Form.Group>
                            <Form.Label>Select a student:</Form.Label>
                            <Select
                                value={this.state.selectedStudent}
                                options={this.props.studentsSearchOptions}
                                onChange={(student) => this.setState({selectedStudent: student})}
                            />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Write a note for the parents:</Form.Label>
                            <Form.Control as="textarea"
                                          value={this.state.noteContent}
                                          onChange={(e) => this.setState({noteContent: e.target.value})}/>
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="success" onClick={() => this.createNote()}>Create note</Button>
                    <Button variant="danger" onClick={this.props.handleClose}>Cancel</Button>
                </Modal.Footer>
            </Modal>
        );
    }
}