import React from "react";
import {Button, Container, Form, Table} from "react-bootstrap";
import SectionHeader from "../../utils/section-header";
import ParentAccountEnabling from "./new-parent-account";

export default class ParentAccess extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            parents: [],
            selectedParents: 0,
            showNewAccountCreation: false
        }
    }

    async componentDidMount() {
        const parents = await this.fetchParents();
        parents.forEach(parent => parent.selected = false);
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

    async sendCredentials() {
        let parents = [];
        this.state.parents.forEach(parent => {
            if (parent.selected) {
                parents.push(parent._id);
            }
        });
        const url = 'http://localhost:3000/parents';
        const options = {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({
                parents
            })
        };
        let response = await fetch(url, options);
        return await response.json();
    }

    toggleSelectAll(select) {
        if (select) {
            this.state.parents.forEach(parent => parent.selected = true);
            this.setState({selectedParents: this.state.parents.length});
        } else {
            this.state.parents.forEach(parent => parent.selected = false);
            this.setState({selectedParents: 0});
        }
    }

    selectHandler(parent) {
        parent.selected = !parent.selected;
        parent.selected ? this.setState({selectedParents: this.state.selectedParents + 1}) : this.setState({selectedParents: this.state.selectedParents - 1});
    }

    render() {
        return (
            <>
            {this.state.showNewAccountCreation === false &&
            <Container fluid>
                <SectionHeader>Manage parents accesses</SectionHeader>
                <Button variant="primary" className="m-1" onClick={() => this.setState({showNewAccountCreation: true})}>Create a new parent account</Button>
                <Button variant="primary" className="m-1" onClick={() => this.sendCredentials()}>Send credentials to selected parents ({this.state.selectedParents})</Button>
                <h6 className="mt-2">List of parents who haven't logged in yet:</h6>
                <Table responsive striped size="sm" className="mt-1">
                    <thead>
                    <tr>
                        <th className="text-center">
                            <Form.Check type="checkbox"
                                        id="selectAll"
                                        onChange={(e) => this.toggleSelectAll(e.target.checked)}
                            />
                        </th>
                        <th>SSN</th>
                        <th>First name</th>
                        <th>Last name</th>
                        <th>Email</th>
                    </tr>
                    </thead>
                    <tbody>
                    {this.state.parents.map(parent =>
                        <tr key={parent.ssn}>
                            <td className="align-middle text-center">
                                <Form.Check type="checkbox"
                                            id="selectAll"
                                            checked={parent.selected}
                                            onChange={(e) => this.selectHandler(parent)} />
                            </td>
                            <td className="align-middle">{parent.ssn}</td>
                            <td className="align-middle">{parent.name}</td>
                            <td className="align-middle">{parent.surname}</td>
                            <td className="align-middle">{parent.mail}</td>
                        </tr>
                    )}
                    </tbody>
                </Table>
            </Container>}
        {this.state.showNewAccountCreation &&
        <ParentAccountEnabling handleClose={() => this.setState({showNewAccountCreation: false})}/>}
        </>
        );
    }
}