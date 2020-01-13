import React from 'react';
import {Alert, Button, Container, FormControl, InputGroup, Row, Table} from 'react-bootstrap';
import {FaSistrix} from 'react-icons/fa';
import NewUserForm from "./new-user-form/new-user-form";
import DeleteUserModal from "./delete-user-modal/delete-user-modal";
import EditUserForm from "./edit-user-form/edit-user-form";
import SectionHeader from "../../utils/section-header";

export default class AccountsManagement extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            users: [],
            filteredUsers: [],
            showNewUserForm: false,
            hasAddedUser: false,
            showDeleteUserModal: false,
            showEditUserForm: false,
            targetUser: {},
        }
    }

    async componentDidMount() {
        await this.fetchUsers();
    }

    async fetchUsers() {
        const url = 'http://localhost:3000/users';
        const options = {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            credentials: 'include'
        };
        const response = await fetch(url, options);
        const responseJson = await response.json();
        this.setState({
            users: responseJson.users,
            filteredUsers: responseJson.users
        });
    }

    popDeleteUserModal(user) {
        this.setState({
            targetUser: user,
            showDeleteUserModal: true,
        });
    }

    popUpdateUserForm(user) {
        this.setState({
            targetUser: user,
            showEditUserForm: true,
        });
    }

    handleCloseNewUserForm(hasAddedUser) {
        this.setState({
            showNewUserForm: false,
            hasAddedUser
        });
    }

    handleFilterUser(value) {
        value = value.toLowerCase();
        let filteredUsers = this.state.users.filter(user => {
            if (user.hasOwnProperty('name') && user.hasOwnProperty('surname')) {
                if ([user.name, user.surname].join(' ').toLowerCase().startsWith(value)) {
                    return true;
                }
                if ([user.surname, user.name].join(' ').toLowerCase().startsWith(value)) {
                    return true;
                }
            }
            if (user.hasOwnProperty('ssn') && user.ssn.toLowerCase().startsWith(value)) {
                return true;
            }
            return user.hasOwnProperty('mail') && user.mail.toLowerCase().startsWith(value);

        });
        this.setState({
            filteredUsers
        });
    }

    render() {
        return (
            <Container fluid>
                <DeleteUserModal user={this.state.targetUser} show={this.state.showDeleteUserModal}
                                 handleClose={async () => {
                                     await this.fetchUsers();
                                     this.setState({showDeleteUserModal: false})
                                 }}/>
                <EditUserForm user={this.state.targetUser} show={this.state.showEditUserForm} handleClose={async () => {
                    await this.fetchUsers();
                    this.setState({showEditUserForm: false})
                }}/>
                <SectionHeader>Users</SectionHeader>
                <Row className="mb-2">
                    <Button onClick={() => this.setState({showNewUserForm: true})}>New user</Button>
                    <NewUserForm show={this.state.showNewUserForm} handleClose={async (hasAddedUser) => {
                        await this.fetchUsers();
                        this.handleCloseNewUserForm(hasAddedUser)
                    }}/>
                    <InputGroup className={"ml-auto col-8 col-md-5 col-lg-4 col-xl-3"}>
                        <InputGroup.Prepend>
                            <InputGroup.Text id="basic-addon1"><FaSistrix/></InputGroup.Text>
                        </InputGroup.Prepend>
                        <FormControl
                            placeholder="User search..."
                            aria-label="User"
                            aria-describedby="basic-addon1"
                            onChange={(e) => this.handleFilterUser(e.target.value)}
                        />
                    </InputGroup>
                </Row>
                {this.state.hasAddedUser && (
                    <Alert variant='success'>The user has been successfully created and will receive an email containing
                        their credentials.</Alert>
                )}
                <Row>
                    <Table className="col" striped hover bordered responsive size="sm">
                        <thead>
                        <tr>
                            <th>SSN</th>
                            <th>First name</th>
                            <th>Last name</th>
                            <th>Email</th>
                            <th>Role</th>
                            <th>Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        {this.state.filteredUsers.map(user =>
                            <tr key={user.ssn}>
                                <td className="align-middle">{user.ssn}</td>
                                <td className="align-middle">{user.name}</td>
                                <td className="align-middle">{user.surname}</td>
                                <td className="align-middle">{user.mail}</td>
                                <td className="align-middle">{user.scope}</td>
                                <td>
                                    <Button size="sm" className='mr-1'
                                            onClick={() => this.popUpdateUserForm(user)}>Edit</Button>
                                    <Button size="sm" onClick={() => this.popDeleteUserModal(user)}
                                            variant={'danger'}>Delete</Button>
                                </td>
                            </tr>
                        )}
                        </tbody>
                    </Table>
                </Row>
                {/*<Row>
                    <Pagination className="col justify-content-center">
                        <Pagination.First/>
                        <Pagination.Prev/>
                        <Pagination.Item>{1}</Pagination.Item>
                        <Pagination.Ellipsis/>

                        <Pagination.Item>{10}</Pagination.Item>
                        <Pagination.Item>{11}</Pagination.Item>
                        <Pagination.Item active>{12}</Pagination.Item>
                        <Pagination.Item>{13}</Pagination.Item>
                        <Pagination.Item>{14}</Pagination.Item>

                        <Pagination.Ellipsis/>
                        <Pagination.Item>{20}</Pagination.Item>
                        <Pagination.Next/>
                        <Pagination.Last/>
                    </Pagination>
                </Row>*/}
            </Container>
        );
    }
}