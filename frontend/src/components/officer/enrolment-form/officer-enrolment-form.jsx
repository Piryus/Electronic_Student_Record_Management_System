import React, { Component } from 'react';
import Table from 'react-bootstrap/table';
import Form from 'react-bootstrap/form';
import SectionHeader from "../../utils/section-header";



class EnrolmentForm extends Component {

  constructor(props){
    super(props);

    this.state = {
      students: [],
      ssn: "",
      name: "",
      surname: "",
      wantEnroll: false
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

  async enrollStudent(){
    if(this.state.name === "" || this.state.surname === "" || this.state.ssn === ""){
      alert('Please fill in all the fields.');
    } else{
      await this.pushEnrollmentToDB();
      //Update state here
      this.setState({
        name: "",
        surname: "",
        ssn: "",
        wantEnroll: false
      });
      window.location.reload(false);
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
        alert('Ops! There was an error. Please try again.');
    } else{
        alert('Student enrolled correctly!');
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
                <SectionHeader>Enroll students</SectionHeader>
        <p class="btn btn-primary bg-blue border-blue ml-3" onClick={() => this.setState({wantEnroll: true})} role="button">Enroll a Student</p>
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
            <p class="btn btn-primary bg-blue border-blue ml-3" onClick={() => this.enrollStudent()} role="button">Enroll Student</p>
            </Form>
          </div>
        )}
      </div>
    )
  }
}

export default EnrolmentForm;
