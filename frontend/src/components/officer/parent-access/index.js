import React from "react";
import {Button, Container, Table} from "react-bootstrap";
import SectionHeader from "../../utils/section-header";

export default class ParentAccess extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            parents: []
        }
    }

    async componentDidMount() {
        const parents = await this.fetchParents();
        this.setState({parents});
    }

    async fetchParents() {
        // Fetches parents who didn't log-in yet
        const url = 'http://localhost:3000/parents';
        const options = {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            credentials: 'include',
        };
        let response = await fetch(url, options);
        return await response.json();
    }

    render() {
        return (
            <Container fluid>
                <SectionHeader>Manage parents accesses</SectionHeader>
                <Button variant="primary">Create a new parent account</Button>
                <Table responsive striped bordered size="sm">
                    <thead>
                    <tr>
                        <th>Checkbox</th>
                        <th>SSN</th>
                        <th>First name</th>
                        <th>Last name</th>
                        <th>Email</th>
                    </tr>
                    </thead>
                    <tbody>
                    {/*{this.state.filteredUsers.map(user =>*/}
                    {/*    <tr key={user.ssn}>*/}
                    {/*        <td className="align-middle">{user.ssn}</td>*/}
                    {/*        <td className="align-middle">{user.ssn}</td>*/}
                    {/*        <td className="align-middle">{user.name}</td>*/}
                    {/*        <td className="align-middle">{user.surname}</td>*/}
                    {/*        <td className="align-middle">{user.mail}</td>*/}
                    {/*    </tr>*/}
                    {/*)}*/}
                    </tbody>
                </Table>
            </Container>
        );
    }
}