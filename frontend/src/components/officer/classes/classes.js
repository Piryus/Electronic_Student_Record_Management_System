import React from 'react';
import styles from './styles.module.css';
import Form from 'react-bootstrap/Form';
import Accordion from "react-bootstrap/Accordion";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";

class Classes extends React.Component{

    constructor(props){
        super(props);

        this.state = {
            wantCreateAClass: false,
            classNameChosen: "",
            classIdNewClass: "",
            studentsForNewClass: [],
            students: [],
            classes: []
        }
    }

    async componentDidMount(){
        await this.getAllStudents();
    }

    async componentWillMount(){
        await this.getClasses();
        let classesVectorWithClassNameAsIndex = [];
        classesVectorWithClassNameAsIndex["No class"] = {name: "No class"};
        this.state.classes.forEach((c) => {
            classesVectorWithClassNameAsIndex[c._id.toString()] = c;
        });
        this.setState({classes: classesVectorWithClassNameAsIndex});
    }

    async getClasses(){
        const url = 'http://localhost:3000/classes/all';
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
            classes: json.classes
        });
    }

    async getAllStudents(){
        const url = 'http://localhost:3000/students/all';
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

    async pushClassToDB(){
        const url = 'http://localhost:3000/classes';
        const jsonToSend = JSON.stringify({
            name: this.state.classNameChosen,
            students: this.state.studentsForNewClass
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
            alert('Error! Please insert a class Name');
        } else{
            alert('Class created successfully!');
        }
    }

    async createClass(){
        //Send info to backend here
        await this.pushClassToDB();
        //THEN

        this.setState({
            wantCreateAClass: false,
            studentsForNewClass: [],
            classNameChosen: "",
        });
        window.location.reload(false);
    }

    addStudentToNewClass(e){
        let values = this.state.studentsForNewClass;
        if(!values.includes(e.target.id)){
            values.push(e.target.id);
        } else{
            let newVett = values;
            for(var v in values){
                if(values[v] === e.target.id){
                    newVett.splice(v, 1);
                    break;
                }
            }
            values = newVett;
        }
        this.setState({studentsForNewClass: values});
    }

    renderStudentsCheckbox(){
        let checkboxToRender = [];
        this.state.students.forEach((student) => {
            checkboxToRender.push(
                <Form.Check
                    type='checkbox'
                    id= {student._id.toString()}
                    label={student.surname + ' ' + student.name + ' SSN: ' + student.ssn}
                    onChange={(e) => this.addStudentToNewClass(e)}
                />
            );
        });
        return checkboxToRender;
    }

    render(){

        //Building of Grades and Subejects DOM
        let studentSortedClass = [];
        let gradesDOM = [];
        if (this.state.students !== null) {
            this.state.students.forEach((student) => {
                if(student.classId == null){
                    student.classId = "No class";
                }
                if(studentSortedClass[student.classId] == null){
                    studentSortedClass[student.classId] = [];
                }
                studentSortedClass[student.classId].push(
                <Accordion.Collapse eventKey={student.classId.toString()}>
                    <Card.Body>Student {studentSortedClass[student.classId].length+1}: Name: {student.name} Surname: {student.surname} SSN: {student.ssn} </Card.Body>
                </Accordion.Collapse>
                );
            });
            let index;
            for(index in studentSortedClass){
                gradesDOM.push(
                <Card>
                    <Card.Header>
                        <Accordion.Toggle as={Button} variant="link" eventKey={index.toString()}>
                            Class name: {this.state.classes[index.toString()].name}
                        </Accordion.Toggle>
                    </Card.Header>
                    {studentSortedClass[index].map((student) => {
                        return student;
                    })}
                </Card>
                );
            }
        }

        let checkboxToRender = this.renderStudentsCheckbox();


        return(
            <div>
            {this.state.wantCreateAClass === false && (
            <Accordion className={styles.gradesContainer} defaultActiveKey="0">
                {gradesDOM.map((oneClass) => {
                    return oneClass;
                })}
                <br></br>
                <p class="btn btn-primary bg-blue border-blue ml-3" onClick={() => this.setState({wantCreateAClass: true})} role="button">Create a class</p>
            </Accordion>)}
            {this.state.wantCreateAClass === true &&(
            <Accordion className={styles.gradesContainer} defaultActiveKey="0">
                <Form /*onSubmit={() => this.createClass()}*/>
                    <Form.Group controlId="formBasicEmail">
                        <Form.Label>Class name</Form.Label>
                        <Form.Control type="text" placeholder="Class names examples: 1A, 1B, 3C, 5B" onChange={(e) => this.setState({classNameChosen: e.target.value})}/>
                        <Form.Text className="text-muted">
                        Class name must contain a number from 1 to 5 and an alphabet letter.
                        </Form.Text>
                    </Form.Group>
                    <div key='custom-checkbox' className="mb-3">
                    {checkboxToRender.map((c) => {
                        return c;
                    })}
                    </div>
                    <Button variant="primary" onClick={() => this.createClass()}>
                        Submit
                    </Button>
                </Form>
            </Accordion>
            )}
            </div>
        );
    }
}

export default Classes;