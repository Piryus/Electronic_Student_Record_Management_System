import React from 'react';
import styles from "./navbar.module.css";
import Navbar from "react-bootstrap/Navbar";
import Dropdown from "react-bootstrap/Dropdown";
import PropTypes from 'prop-types';
import {Button, Row} from "react-bootstrap";

export default class AppNavbar extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        let childNotSelected = [];
        if (this.props.type === 'parent') {
            this.props.children.map((child) => {
                if (child._id !== this.props.selectedChild._id)
                    childNotSelected.push(
                        <Dropdown.Item key={child._id}
                                       onClick={() => this.props.childSelection(child)}>
                            {[child.name, child.surname].join(' ')}
                        </Dropdown.Item>);
            });
        }

        return (
            <Navbar fixed="top" bg="dark" className={["navbar-dark shadow flex-md-nowrap", styles.navbar]}>
                <div className="d-md-none mr-1">
                    <Button variant='primary' onClick={() => this.props.onHamburgerMenu()}>Test</Button>
                </div>
                <Navbar.Brand>SE2</Navbar.Brand>
                {this.props.type === 'parent' &&
                <Dropdown className={'ml-auto'}>
                    <Dropdown.Toggle id="dropdown-basic">
                        {[this.props.selectedChild.name, this.props.selectedChild.surname].join(' ')}&nbsp;
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                        {childNotSelected.map((child) => {
                            return child
                        })}
                    </Dropdown.Menu>
                </Dropdown>}
                <Button variant='danger' onClick={() => this.props.onLogout()} className={this.props.type === 'classic' ? 'ml-auto' : 'ml-2'}
                        role="button">Logout</Button>
            </Navbar>
        );
    }
}

AppNavbar.propTypes = {
    type: PropTypes.oneOf(['classic', 'parent']),
};