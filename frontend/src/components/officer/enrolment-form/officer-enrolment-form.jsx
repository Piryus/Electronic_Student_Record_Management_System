import React, { Component } from 'react';
import {Table, Alert, Button} from 'react-bootstrap';
import Form from 'react-bootstrap/Form';
import SectionHeader from "../../utils/section-header";



class EnrolmentForm extends Component {

  constructor(props){
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

  async componentDidMount(){
    await this.getAllStudents();
  }

  async getAllStudents(){
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

  async enrollStudent(event){
    event.preventDefault();
    if(this.state.name === "" || this.state.surname === "" || this.state.ssn === ""){
      this.setState({
        success: '',
        warning: 'Please fill all fields!',
        error: ''
      });
    } else{
      await this.pushEnrollmentToDB();
      //Update state here
      this.setState({
        name: "",
        surname: "",
        ssn: "",
      });
    }
  }

  async pushEnrollmentToDB(){
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
    if(json.error != null){
        this.setState({
          success: '',
          warning: '',
          error: 'Ops! There was an error. Please try again.'
        });
    } else{
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
        <td>{renderDOM.length+1}</td>
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
        <Button variant='primary' onClick={() => this.setState({wantEnroll: true})} >Enroll a Student</Button><br></br><br></br>
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
            {renderDOM.map((toRender)=>{
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
            <Form.Group controlId="formGroupEmail">
              <Form.Label>Surname</Form.Label>
              <Form.Control type="text" placeholder="Enter Surname" onChange={(e) => this.setState({surname: e.target.value})}/>
            </Form.Group>
            <Form.Group controlId="formGroupPassword">
              <Form.Label>Name</Form.Label>
              <Form.Control type="text" placeholder="Enter Name" onChange={(e) => this.setState({name: e.target.value})}/>
            </Form.Group>
            <Form.Group controlId="formGroupPassword">
              <Form.Label>SSN Code</Form.Label>
              <Form.Control type="text" placeholder="Enter SSN Code" onChange={(e) => this.setState({ssn: e.target.value})}/>
            </Form.Group>
            <Button variant='primary' onClick={(event) => this.enrollStudent(event)}> Enroll Student</Button>
            </Form>
          </div>
        )}
      </div>
    )
  }
}

export default EnrolmentForm;
