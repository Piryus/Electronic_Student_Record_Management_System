import React from 'react';
import {Button, Modal} from "react-bootstrap";

export default class DeleteUserModal extends React.Component {
    constructor(props) {
        super(props);
    }

    deleteUser() {
        // Use this.props.user
        // TODO Call backend to delete user
        this.props.handleClose();
    }

    render() {
        return(
            <Modal show={this.props.show} onHide={this.props.handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title className="text-center">Are you sure you want to delete {this.props.user.name} {this.props.user.surname}?</Modal.Title>
                </Modal.Header>
                <Modal.Footer>
                    <Button variant="success" onClick={() => this.deleteUser()}>Delete</Button>
                    <Button variant="danger" onClick={this.props.handleClose}>Cancel</Button>
                </Modal.Footer>
            </Modal>
        );
    }
}