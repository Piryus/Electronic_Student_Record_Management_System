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
        if (this.state.name === "" || this.state.surname === "" || this.state.ssn === "") {
            this.setState({
                success: '',
                warning: 'Please fill all fields!',
                error: ''
            });
        } else {
            await this.pushEnrollmentToDB();
            //Update state here
            this.setState({
                name: "",
                surname: "",
                ssn: "",
            });
        }
    }

    async pushEnrollmentToDB() {
        const url = 'http://localhost:3000/students';
        const jsonToSend = JSON.stringify({
            ssn: this.state.ssn,
            name: this.state.name,
            surname: this.state.surname
        });
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
                                    <Form.Group controlId="formGroupEmail">
                                        <Form.Control type="text" placeholder="Surname"
                                                      onChange={(e) => this.setState({surname: e.target.value})}/>
                                    </Form.Group>
                                </Col>
                                <Col>
                                    <Form.Group controlId="formGroupPassword">
                                        <Form.Control type="text" placeholder="Name"
                                                      onChange={(e) => this.setState({name: e.target.value})}/>
                                    </Form.Group>
                                </Col>
                            </Row>
                            <Form.Group controlId="formGroupPassword">
                                <Form.Control type="text" placeholder="SSN"
                                              onChange={(e) => this.setState({ssn: e.target.value})}/>
                            </Form.Group>

                            <h6>Parent 1</h6>
                            <Row>
                                <Col>
                                    <Form.Group controlId="formParentName">
                                        <Form.Control type="string"
                                                      placeholder="Name"
                                                      value={this.state.parentName}
                                                      onChange={(e) => this.setState({parentName: e.target.value})}/>
                                        <Form.Text className="text-muted">
                                        </Form.Text>
                                    </Form.Group>
                                </Col>
                                <Col>
                                    <Form.Group controlId="formParentSurname">
                                        <Form.Control type="string"
                                                      placeholder="Surname"
                                                      value={this.state.parentSurname}
                                                      onChange={(e) => this.setState({parentSurname: e.target.value})}/>
                                        <Form.Text className="text-muted">
                                        </Form.Text>
                                    </Form.Group>
                                </Col>
                            </Row>
                            <Row>
                                <Col>
                                    <Form.Group controlId="formSSN">
                                        <Form.Control type="string"
                                                      placeholder="SSN"
                                                      value={this.state.parentSsn}
                                                      onChange={(e) => this.setState({parentSsn: e.target.value})}/>
                                        <Form.Text className="text-muted">
                                        </Form.Text>
                                    </Form.Group>
                                </Col>
                                <Col>
                                    <Form.Group controlId="formEmail">
                                        <Form.Control type="email"
                                                      placeholder="Email"
                                                      value={this.state.parentEmail}
                                                      onChange={(e) => this.setState({parentEmail: e.target.value})}/>
                                        <Form.Text className="text-muted">
                                        </Form.Text>
                                    </Form.Group>
                                </Col>
                            </Row>
                            <Form.Check custom type="switch" className="mb-1">
                                <Form.Check.Input type="checkbox" id="parent-2-switch"/>
                                <Form.Check.Label htmlFor="parent-2-switch"><h6>Parent 2</h6></Form.Check.Label>
                            </Form.Check>
                            <Row>
                                <Col>
                                    <Form.Group controlId="formParentName">
                                        <Form.Control type="string"
                                                      placeholder="Name"
                                                      value={this.state.parentName}
                                                      onChange={(e) => this.setState({parentName: e.target.value})}/>
                                        <Form.Text className="text-muted">
                                        </Form.Text>
                                    </Form.Group>
                                </Col>
                                <Col>
                                    <Form.Group controlId="formParentSurname">
                                        <Form.Control type="string"
                                                      placeholder="Surname"
                                                      value={this.state.parentSurname}
                                                      onChange={(e) => this.setState({parentSurname: e.target.value})}/>
                                        <Form.Text className="text-muted">
                                        </Form.Text>
                                    </Form.Group>
                                </Col>
                            </Row>
                            <Row>
                                <Col>
                                    <Form.Group controlId="formSSN">
                                        <Form.Control type="string"
                                                      placeholder="SSN"
                                                      value={this.state.parentSsn}
                                                      onChange={(e) => this.setState({parentSsn: e.target.value})}/>
                                        <Form.Text className="text-muted">
                                        </Form.Text>
                                    </Form.Group>
                                </Col>
                                <Col>
                                    <Form.Group controlId="formEmail">
                                        <Form.Control type="email"
                                                      placeholder="Email"
                                                      value={this.state.parentEmail}
                                                      onChange={(e) => this.setState({parentEmail: e.target.value})}/>
                                        <Form.Text className="text-muted">
                                        </Form.Text>
                                    </Form.Group>
                                </Col>
                            </Row>


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
