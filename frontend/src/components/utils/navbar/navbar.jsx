import React from 'react';
import styles from "./navbar.module.css";
import PropTypes from 'prop-types';
import {Button, Dropdown, Navbar} from "react-bootstrap";
import {TiThMenu} from 'react-icons/ti';

export default class AppNavbar extends React.Component {
    render() {
        let childNotSelected = [];
        if (this.props.type === 'parent') {
            this.props.children.forEach((child) => {
                if (child._id !== this.props.selectedChild._id)
                    childNotSelected.push(
                        <Dropdown.Item key={child._id}
                                       onClick={() => this.props.childSelection(child)}>
                            {[child.name, child.surname].join(' ')}
                        </Dropdown.Item>);
            });
        }
        let classNotSelected = [];
        if(this.props.type === 'teacher' ) {
                this.props.classes.forEach(c => {
                    if (c._id !== this.props.selectedClass._id){
                        classNotSelected.push(
                            <Dropdown.Item key={c._id}
                                           onClick={() => this.props.classSelection(c)}>
                                {c.name}
                            </Dropdown.Item>
                        );
                    }
            });
        }

        return (
            <Navbar fixed="top" bg="dark" className={["navbar-dark shadow flex-md-nowrap", styles.navbar]}>
                <div className="d-md-none mr-1">
                    <Button className="mr-1" variant='primary' onClick={() => this.props.onHamburgerMenu()}><TiThMenu style={{verticalAlign: 'middle'}}/></Button>
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
                {this.props.type === 'teacher' &&
                <Dropdown className={'ml-auto'}>
                    <Dropdown.Toggle id="dropdown-basic">
                        {this.props.selectedClass.name}
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                        {classNotSelected.map((c) => {
                            return c
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