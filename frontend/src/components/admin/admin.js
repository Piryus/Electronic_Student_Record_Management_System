import React from 'react';
import AppNavbar from "../common-components/navbar/navbar";
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
            userRequest: 'accounts',
            sidebarOpen: false,
        };
    }

    setUserRequest(e, choice) {
        this.setState({userRequest: choice});
    }

    render(){
        return (
            <div>
                <AppNavbar type='classic' onLogout={() => this.props.onLogout()} onHamburgerMenu={() => this.setState({sidebarOpen: !this.state.sidebarOpen})}/>
                <Container fluid>
                    <Row>
                        <Nav className={[this.state.sidebarOpen ? 'bg-light col-5':'d-none', "flex-column bg-light col-md-2 d-md-block", styles.sidebar]}>
                            <Nav.Link className={this.state.userRequest === 'accounts' ? styles.sidebarLinkActive : styles.sidebarLink} onClick={(e) => this.setUserRequest(e, "accounts")}><FaUserEdit/> Users management</Nav.Link>
                        </Nav>
                        <main className={"col-md-10 ml-sm-auto px-4 pt-5"}>
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