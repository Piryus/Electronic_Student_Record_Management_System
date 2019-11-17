import React from 'react';
import styles from './styles.module.css';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Nav from 'react-bootstrap/Nav';
import Navbar from "react-bootstrap/Navbar";
import Dropdown from "react-bootstrap/Dropdown";
import Accordion from "react-bootstrap/Accordion";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import ParentAccountEnabling from './parent-access/officer-parent-access';
import Classes from './classes/classes';
import {FaUserEdit, FaLayerGroup, FaCog} from 'react-icons/fa'

export default class Officer extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            userRequest: '', //By default

        };
        this.setUserRequest = this.setUserRequest.bind(this);
    }

    async componentDidMount() {
        //await this.getChildGrades();
    }

    async componentWillUpdate() {
        //await this.getChildGrades();
    }


    setUserRequest(e, choice) {
        this.setState({userRequest: choice});
    }

    render() {

        return (
            <div className={styles.root}>
                <Navbar fixed="top" bg="dark" className={["navbar-dark shadow flex-md-nowrap", styles.navbar]}>
                    <Navbar.Brand>SE2</Navbar.Brand>
                    <a class="btn btn-primary bg-danger border-danger ml-auto" href="/logout" role="button">Logout</a>
                </Navbar>
                <Container fluid>
                    <Row>
                        <Nav defaultActiveKey="/home"
                             className={["flex-column bg-light col-md-2 d-none d-md-block", styles.sidebar]}>
                            <Nav.Link className={styles.sidebarLink} onClick={(e) => this.setUserRequest(e, "accounts")}><FaUserEdit/> Accounts</Nav.Link>
                            <Nav.Link className={styles.sidebarLink} onClick={(e) => this.setUserRequest(e, "classes")}><FaLayerGroup/> Classes</Nav.Link>
                            <Nav.Link className={styles.sidebarLink} eventKey="link-1"><FaCog/> Settings</Nav.Link>
                        </Nav>
                        <main className={[styles.mainContainer, "col-md-9 ml-sm-auto col-lg-10 px-4 pt-5"]}>
                            <h2>Welcome officer</h2>
                                {this.state.userRequest === 'accounts' &&(
                                    <ParentAccountEnabling/>
                                )}
                                {this.state.userRequest === 'classes' &&(
                                    <Classes/>
                                )}
                        </main>
                    </Row>
                </Container>
            </div>
        );
    }
}