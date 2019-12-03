import React from 'react';
import {Alert, Button, Form, Modal} from "react-bootstrap";

export default class NewArticleModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            title: '',
            content: '',
            errorSubmit: false
        };
    }

    async submitNewArticle() {
        const url = 'http://localhost:3000/articles';
        const options = {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({
                title: this.state.title,
                content: this.state.content
            })
        };
        const response = await fetch(url, options);
        const responseJson = await response.json();
        if (responseJson.success === true) {
            this.props.handleClose();
        } else {
            this.setState({errorSubmit: true});
        }
    }

    render() {
        return (
            <Modal show={this.props.show} onHide={this.props.handleClose} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>Write an article</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {this.state.errorSubmit &&(
                        <Alert variant='danger'>Unable to submit the article.</Alert>
                    )}
                    <Form>
                        <Form.Group controlId="formTitle">
                            <Form.Label>Title:</Form.Label>
                            <Form.Control type="text"
                                          placeholder="Enter article title"
                                          value={this.state.title}
                                          onChange={(e) => this.setState({title: e.target.value})}/>
                            <Form.Text className="text-muted">
                            </Form.Text>
                        </Form.Group>
                        <Form.Group controlId="formContent">
                            <Form.Label>Content:</Form.Label>
                            <Form.Control as="textarea"
                                          placeholder="Write about something..."
                                          value={this.state.content}
                                          onChange={(e) => this.setState({content: e.target.value})}/>
                            <Form.Text className="text-muted">
                            </Form.Text>
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="success" onClick={() => this.submitNewArticle()}>Publish</Button>
                    <Button variant="danger" onClick={this.props.handleClose}>Cancel</Button>
                </Modal.Footer>
            </Modal>
        );
    }
}
