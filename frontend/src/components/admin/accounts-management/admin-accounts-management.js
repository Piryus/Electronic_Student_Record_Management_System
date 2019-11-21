import React from 'react';
import {Button, Container, FormControl, InputGroup, Pagination, Row, Table} from 'react-bootstrap';
import {FaSistrix, FaPen, FaTrash} from 'react-icons/fa';
import NewUserForm from "./new-user-form/new-user-form";
import DeleteUserModal from "./delete-user-modal/delete-user-modal";
import EditUserForm from "./edit-user-form/edit-user-form";

export default class AccountsManagement extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            users: [],
            showNewUserForm: false,
            showDeleteUserModal: false,
            showEditUserForm: false,
            targetUser: {mail: 'emile@legendre.com', name: 'Emile', surname: 'Legendre'}
        }
    }

    async componentDidMount() {
        await this.fetchUsers();
    }

    async fetchUsers() {
        // Fetch users from backend
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

    render() {
        return (
            <Container fluid>
                <DeleteUserModal user={this.state.targetUser} show={this.state.showDeleteUserModal} handleClose={() => this.setState({showDeleteUserModal: false})} />
                <EditUserForm user={this.state.targetUser} show={this.state.showEditUserForm} handleClose={() => this.setState({showEditUserForm: false})} />
                <Row>
                    <h1 className="mb-4">Accounts management</h1>
                </Row>
                <Row className="mb-2">
                    <Button onClick={() => this.setState({showNewUserForm: true})}>New user</Button>
                    <NewUserForm show={this.state.showNewUserForm} handleClose={() => this.setState({showNewUserForm: false})} />
                    <InputGroup className={"ml-auto col-5 col-xl-3"}>
                        <InputGroup.Prepend>
                            <InputGroup.Text id="basic-addon1"><FaSistrix/></InputGroup.Text>
                        </InputGroup.Prepend>
                        <FormControl
                            placeholder="User search..."
                            aria-label="User"
                            aria-describedby="basic-addon1"
                        />
                    </InputGroup>
                </Row>
                <Row>
                    <Table className="col" striped hover bordered>
                        <thead>
                        <tr>
                            <th>ID</th>
                            <th>First name</th>
                            <th>Last name</th>
                            <th>Email</th>
                            <th>Role</th>
                            <th>Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr>
                            <td className="align-middle">124959848484</td>
                            <td className="align-middle">Emile</td>
                            <td className="align-middle">Legendre</td>
                            <td className="align-middle">emile@legendre.com</td>
                            <td className="align-middle">Admin</td>
                            <td>
                                <Button className='mr-1' onClick={() => this.popUpdateUserForm({mail: 'emile@legendre.com', name: 'Emile', surname: 'Legendre'})}>Edit</Button>
                                <Button onClick={() => this.popDeleteUserModal({mail: 'emile@legendre.com', name: 'Emile', surname: 'Legendre'})} variant={'danger'}>Delete</Button>
                            </td>
                        </tr>
                        </tbody>
                    </Table>
                </Row>
                <Row>
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
                </Row>
            </Container>
        );
    }
}