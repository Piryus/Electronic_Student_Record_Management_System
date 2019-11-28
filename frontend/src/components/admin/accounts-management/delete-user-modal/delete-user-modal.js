import React from 'react';
import {Alert, Button, Modal} from "react-bootstrap";

export default class DeleteUserModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            error: false
        }
    }

    async deleteUser() {
        try {
            const url = 'http://localhost:3000/users/' + this.props.user._id;
            const options = {
                method: 'DELETE',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                credentials: 'include'
            };
            const response = await fetch(url, options);
            const responseJson = await response.json();
            if (responseJson.success) {
                this.props.handleClose(true);
            } else {
                this.setState({error: true});
            }
        } catch (e) {
            this.setState({error: true});
        }

    }

    render() {
        return (
            <Modal show={this.props.show} onHide={this.props.handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title className="text-center">Are you sure you want to
                        delete {this.props.user.name} {this.props.user.surname}?</Modal.Title>
                </Modal.Header>
                {this.state.error && (
                    <Modal.Body>
                        <Alert variant='danger'>Unable to delete this user.</Alert>
                    </Modal.Body>
                )}
                <Modal.Footer>
                    <Button variant="success" onClick={() => this.deleteUser()}>Delete</Button>
                    <Button variant="danger" onClick={this.props.handleClose}>Cancel</Button>
                </Modal.Footer>
            </Modal>
        );
    }
}