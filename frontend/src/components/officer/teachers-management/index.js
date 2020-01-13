import React from "react";
import {Button, Container, Table} from "react-bootstrap";
import SectionHeader from "../../utils/section-header";
import LoadingSpinner from "../../utils/loading-spinner";
import EditTeacherModal from "./edit-teacher-form";

export default class TeachersManagement extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            teachers: [],
            isLoading: true,
            showEditModal: false,
            targetTeacher: {}
        };
    }

    async componentDidMount() {
        await this.fetchTeachers();
        this.setState({
            isLoading: false
        });
    }

    async fetchTeachers() {
        const url = 'http://localhost:3000/teachers';
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
            teachers: responseJson.teachers
        });
    }

    popEditModal(teacher) {
        this.setState({
            showEditModal: true,
            targetTeacher: teacher
        });
    }

    render() {
        return (
            <Container fluid>
                <SectionHeader>Teachers</SectionHeader>
                <EditTeacherModal show={this.state.showEditModal} teacher={this.state.targetTeacher} onClose={async () => {
                    await this.fetchTeachers();
                    this.setState({showEditModal: false})
                }}/>
                {this.state.isLoading && <LoadingSpinner/>}
                {!this.state.isLoading &&
                <Table className="col" striped hover bordered responsive size="sm">
                    <thead>
                    <tr>
                        <th>SSN</th>
                        <th>First name</th>
                        <th>Last name</th>
                        <th>Email</th>
                        <th>Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {this.state.teachers.map(teacher =>
                        <tr key={teacher.ssn}>
                            <td className="align-middle">{teacher.ssn}</td>
                            <td className="align-middle">{teacher.name}</td>
                            <td className="align-middle">{teacher.surname}</td>
                            <td className="align-middle">{teacher.mail}</td>
                            <td>
                                <Button size="sm" className='mr-1'
                                        onClick={() => this.popEditModal(teacher)}>Edit</Button>
                            </td>
                        </tr>
                    )}
                    </tbody>
                </Table>
                }
            </Container>
        );
    }
}