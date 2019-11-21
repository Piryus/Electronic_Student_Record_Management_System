import React from 'react';
import AppNavbar from "../navbar/navbar";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Nav from "react-bootstrap/Nav";
import styles from "../officer/styles.module.css";
import {FaUserEdit} from 'react-icons/fa';
import AccountsManagement from "./accounts-management/admin-accounts-management";

class Admin extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            userRequest: 'accounts'
        };
    }

    setUserRequest(e, choice) {
        this.setState({userRequest: choice});
    }

    render(){
        return (
            <div>
                <AppNavbar type='classic' onLogout={() => this.props.onLogout()} />
                <Container fluid>
                    <Row>
                        <Nav className={["flex-column bg-light col-md-2 d-none d-md-block", styles.sidebar]}>
                            <Nav.Link className={this.state.userRequest === 'accounts' ? styles.sidebarLinkActive : styles.sidebarLink} onClick={(e) => this.setUserRequest(e, "accounts")}><FaUserEdit/> Users management</Nav.Link>
                        </Nav>
                        <main className={[styles.mainContainer, "col-md-9 ml-sm-auto col-lg-10 px-4 pt-5"]}>
                            {this.state.userRequest === 'accounts' &&(
                                <AccountsManagement/>
                            )}
                        </main>
                    </Row>
                </Container>
            </div>
        );
    }
}

export default Admin;