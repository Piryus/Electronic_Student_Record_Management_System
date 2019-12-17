import React, {Component} from 'react';
import {Alert, Button, Col, Row, Table} from 'react-bootstrap';
import Form from 'react-bootstrap/Form';
import SectionHeader from "../../utils/section-header";


class EnrolmentForm extends Component {

    constructor(props) {
        super(props);

        this.state = {
            students: [],
            ssn: "",
            name: "",
            surname: "",
            parentOneName: '',
            parentOneSurname: '',
            parentOneSsn: '',
            parentOneEmail: '',
            parentTwo: false,
            parentTwoName: '',
            parentTwoSurname: '',
            parentTwoSsn: '',
            parentTwoEmail: '',
            wantEnroll: false,
            warning: '',
            error: '',
            success: ''
        };
    }

    async componentDidMount() {
        await this.getAllStudents();
    }

    async getAllStudents() {
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

    async enrollStudent(event) {
        event.preventDefault();
        if (this.state.name === "" ||
            this.state.surname === "" ||
            this.state.ssn === "" ||
            this.state.parentOneName === '' ||
            this.state.parentOneSurname === '' ||
            this.state.parentOneEmail === '' ||
            this.state.parentOneSsn === '' ||
            (this.state.parentTwo && (this.state.parentTwoName === '' ||
                this.state.parentTwoSurname === '' ||
                this.state.parentTwoEmail === '' ||
                this.state.parentTwoSsn === ''))) {
            this.setState({
                success: '',
                warning: 'Please fill all fields!',
                error: ''
            });
        } else {
            await this.pushEnrollmentToDB();
            //Update state here
            this.setState({
                ssn: "",
                name: "",
                surname: "",
                parentOneName: '',
                parentOneSurname: '',
                parentOneSsn: '',
                parentOneEmail: '',
                parentTwo: false,
                parentTwoName: '',
                parentTwoSurname: '',
                parentTwoSsn: '',
                parentTwoEmail: '',
            });
        }
    }

    async pushEnrollmentToDB() {
        const url = 'http://localhost:3000/students';
        let jsonToSend;
        if (this.state.parentTwo === true) {
            jsonToSend = JSON.stringify({
                ssn: this.state.ssn,
                name: this.state.name,
                surname: this.state.surname,
                parentOneName: this.state.parentOneName,
                parentOneSurname: this.state.parentOneSurname,
                parentOneSsn: this.state.parentOneSsn,
                parentOneEmail: this.state.parentOneEmail,
                parentTwoName: this.state.parentTwoName,
                parentTwoSurname: this.state.parentTwoSurname,
                parentTwoSsn: this.state.parentTwoSsn,
                parentTwoEmail: this.state.parentTwoEmail
            });
        } else {
            jsonToSend = JSON.stringify({
                ssn: this.state.ssn,
                name: this.state.name,
                surname: this.state.surname,
                parentOneName: this.state.parentOneName,
                parentOneSurname: this.state.parentOneSurname,
                parentOneSsn: this.state.parentOneSsn,
                parentOneEmail: this.state.parentOneEmail
            });
        }
        const options = {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: jsonToSend
        };
        let response = await fetch(url, options);
        const json = await response.json();
        if (json.error != null) {
            this.setState({
                success: '',
                warning: '',
                error: 'Ops! There was an error. Please try again.'
            });
        } else {
            this.setState({
                success: 'Student enrolled correctly!',
                warning: '',
                error: ''
            });
        }
    }


    render() {

        let renderDOM = [];
        this.state.students.forEach((s) => {
            renderDOM.push(
                <tr>
                    <td>{renderDOM.length + 1}</td>
                    <td>{s.surname}</td>
                    <td>{s.name}</td>
                    <td>{s.ssn}</td>
                </tr>
            );
        });

        return (
            <div>
                {this.state.wantEnroll === false && (<div>
                        <SectionHeader>Enrolled students</SectionHeader>
                        <Button variant='primary' onClick={() => this.setState({wantEnroll: true})}>Enroll a
                            Student</Button><br></br><br></br>
                        <Table striped bordered hover responsive size="sm">
                            <thead>
                            <tr>
                                <th>#</th>
                                <th>Last Name</th>
                                <th>First Name</th>
                                <th>SSN</th>
                            </tr>
                            </thead>
                            <tbody>
                            {renderDOM.map((toRender) => {
                                return toRender;
                            })}
                            </tbody>
                        </Table>
                    </div>
                )}
                {this.state.wantEnroll === true && (
                    <div>
                        <SectionHeader>Enroll student</SectionHeader>
                        {this.state.warning === '' && this.state.error === '' && this.state.success !== '' &&
                        <Alert variant='success'>{this.state.success}</Alert>
                        }
                        {this.state.error !== '' && this.state.success === '' && this.state.warning === '' &&
                        <Alert variant='danger'>{this.state.error}</Alert>
                        }
                        {this.state.error === '' && this.state.success === '' && this.state.warning !== '' &&
                        <Alert variant='warning'>{this.state.warning}</Alert>
                        }
                        <Form>
                            <h6>Student</h6>
                            <Row>
                                <Col>
                                    <Form.Group>
                                        <Form.Control type="text"
                                                      placeholder="Name"
                                                      value={this.state.name}
                                                      onChange={(e) => this.setState({name: e.target.value})}/>
                                    </Form.Group>
                                </Col>
                                <Col>
                                    <Form.Group>
                                        <Form.Control type="text"
                                                      placeholder="Surname"
                                                      value={this.state.surname}
                                                      onChange={(e) => this.setState({surname: e.target.value})}/>
                                    </Form.Group>
                                </Col>
                            </Row>
                            <Form.Group>
                                <Form.Control type="text"
                                              placeholder="SSN"
                                              value={this.state.ssn}
                                              onChange={(e) => this.setState({ssn: e.target.value})}/>
                            </Form.Group>

                            <h6>Parent 1</h6>
                            <Row>
                                <Col>
                                    <Form.Group>
                                        <Form.Control type="string"
                                                      placeholder="Name"
                                                      value={this.state.parentOneName}
                                                      onChange={(e) => this.setState({parentOneName: e.target.value})}/>
                                    </Form.Group>
                                </Col>
                                <Col>
                                    <Form.Group>
                                        <Form.Control type="string"
                                                      placeholder="Surname"
                                                      value={this.state.parentOneSurname}
                                                      onChange={(e) => this.setState({parentOneSurname: e.target.value})}/>
                                    </Form.Group>
                                </Col>
                            </Row>
                            <Row>
                                <Col>
                                    <Form.Group>
                                        <Form.Control type="string"
                                                      placeholder="SSN"
                                                      value={this.state.parentOneSsn}
                                                      onChange={(e) => this.setState({parentOneSsn: e.target.value})}/>
                                    </Form.Group>
                                </Col>
                                <Col>
                                    <Form.Group>
                                        <Form.Control type="email"
                                                      placeholder="Email"
                                                      value={this.state.parentOneEmail}
                                                      onChange={(e) => this.setState({parentOneEmail: e.target.value})}/>
                                    </Form.Group>
                                </Col>
                            </Row>

                            <Form.Check custom type="switch" className="mb-1">
                                <Form.Check.Input type="checkbox"
                                                  id="parent-2-switch"
                                                  checked={this.state.parentTwo}
                                                  onChange={(e) => this.setState({parentTwo: e.target.checked})}
                                />
                                <Form.Check.Label htmlFor="parent-2-switch"><h6>Parent 2</h6></Form.Check.Label>
                            </Form.Check>
                            {this.state.parentTwo &&
                            <>
                                <Row>
                                    <Col>
                                        <Form.Group>
                                            <Form.Control type="string"
                                                          placeholder="Name"
                                                          value={this.state.parentTwoName}
                                                          onChange={(e) => this.setState({parentTwoName: e.target.value})}/>
                                        </Form.Group>
                                    </Col>
                                    <Col>
                                        <Form.Group>
                                            <Form.Control type="string"
                                                          placeholder="Surname"
                                                          value={this.state.parentTwoSurname}
                                                          onChange={(e) => this.setState({parentTwoSurname: e.target.value})}/>
                                        </Form.Group>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col>
                                        <Form.Group>
                                            <Form.Control type="string"
                                                          placeholder="SSN"
                                                          value={this.state.parentTwoSsn}
                                                          onChange={(e) => this.setState({parentTwoSsn: e.target.value})}/>
                                        </Form.Group>
                                    </Col>
                                    <Col>
                                        <Form.Group>
                                            <Form.Control type="email"
                                                          placeholder="Email"
                                                          value={this.state.parentTwoEmail}
                                                          onChange={(e) => this.setState({parentTwoEmail: e.target.value})}/>
                                        </Form.Group>
                                    </Col>
                                </Row>
                            </>}
                            <Button variant='primary' onClick={(event) => this.enrollStudent(event)}> Enroll
                                Student</Button>
                        </Form>
                    </div>
                )}
            </div>
        )
    }
}

export default EnrolmentForm;
