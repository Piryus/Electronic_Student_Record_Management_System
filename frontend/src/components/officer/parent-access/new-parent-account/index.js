import React from 'react';
import {Alert, Button, Form} from 'react-bootstrap';
import Select from 'react-select';
import SectionHeader from "../../../utils/section-header";

export default class ParentAccountEnabling extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            parentEmail: '',
            parentSsn: '',
            parentName: '',
            parentSurname: '',
            students: [],
            searchOptions: [],
            selectedStudent: '',
            alertDom: null,
        };
    }

    async componentDidMount() {
        await this.getStudents();
        this.computeSearchOptions();
    }

    async getStudents() {
        // Query children list
        const url = 'http://localhost:3000/students';
        const options = {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            credentials: 'include',
        };
        let response = await fetch(url, options);
        const json = await response.json();
        this.setState({
            students: json.students
        });
    }

    computeSearchOptions() {
        let options = [];
        this.state.students.forEach((student) => {
            let option = {
                value: student,
                label: student.name + ' ' + student.surname + ' <' + student.ssn + '>'
            };
            options.push(option);
        });
        this.setState({
            searchOptions: options
        });
    }

    async handleSubmitForm() {
        if (this.state.selectedStudent.value === undefined || this.state.parentEmail === '' || this.state.parentName === '' || this.state.parentSurname === '' || this.state.parentSsn === '') {
            const alertDom = <Alert variant={'warning'}>Please fill all fields!</Alert>;
            this.setState({alertDom});
        } else {
            const url = 'http://localhost:3000/parent';
            const mail = this.state.parentEmail;
            const name = this.state.parentName;
            const surname = this.state.parentSurname;
            const ssnParent = this.state.parentSsn;
            const ssnChild = this.state.selectedStudent.value.ssn;
            const options = {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({
                    ssn: ssnParent,
                    name: name,
                    surname: surname,
                    mail: mail,
                    childSsn: ssnChild,
                })
            };
            let response = await fetch(url, options);
            const json = await response.json();
            if (json.success === true) {
                const alertDom = <Alert variant={'success'}>Parent account created! An email was sent to the parent with
                    their credentials!</Alert>;
                this.setState({alertDom});
            } else {
                const alertDom = <Alert variant={'danger'}>Parent account creation failed!</Alert>;
                this.setState({alertDom});
            }
        }
    }

    render() {
        return (
            <div>
                <SectionHeader>Create a parent account</SectionHeader>
                {this.state.alertDom}
                <Form
                    onSubmit={event => {
                        event.preventDefault();
                        this.handleSubmitForm();
                    }}>
                    <Form.Group controlId="formEmail">
                        <Form.Label>Email address of the parent:</Form.Label>
                        <Form.Control type="email"
                                      placeholder="Enter email"
                                      value={this.state.parentEmail}
                                      onChange={(e) => this.setState({parentEmail: e.target.value})}/>
                        <Form.Text className="text-muted">
                        </Form.Text>
                    </Form.Group>
                    <Form.Group controlId="formParentName">
                        <Form.Label>Name of the parent:</Form.Label>
                        <Form.Control type="string"
                                      placeholder="Enter name"
                                      value={this.state.parentName}
                                      onChange={(e) => this.setState({parentName: e.target.value})}/>
                        <Form.Text className="text-muted">
                        </Form.Text>
                    </Form.Group>
                    <Form.Group controlId="formParentSurname">
                        <Form.Label>Surname of the parent:</Form.Label>
                        <Form.Control type="string"
                                      placeholder="Enter name"
                                      value={this.state.parentSurname}
                                      onChange={(e) => this.setState({parentSurname: e.target.value})}/>
                        <Form.Text className="text-muted">
                        </Form.Text>
                    </Form.Group>
                    <Form.Group controlId="formSSN">
                        <Form.Label>SSN of the parent:</Form.Label>
                        <Form.Control type="string"
                                      placeholder="Enter SSN"
                                      value={this.state.parentSsn}
                                      onChange={(e) => this.setState({parentSsn: e.target.value})}/>
                        <Form.Text className="text-muted">
                        </Form.Text>
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Student to link to the parent account:</Form.Label>
                        <Select
                            value={this.state.selectedStudent}
                            options={this.state.searchOptions}
                            onChange={(selectedStudent) => this.setState({selectedStudent})}
                        />
                    </Form.Group>
                    <Button variant="primary" type="submit">Create account</Button>
                    <Button variant="danger" className="ml-2" onClick={() => this.props.handleClose()}>Cancel</Button>
                </Form>
            </div>
        );
    }
}