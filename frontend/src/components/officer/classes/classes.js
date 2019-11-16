import React from 'react';
import styles from './styles.module.css';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import Accordion from "react-bootstrap/Accordion";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import { ENGINE_METHOD_ALL } from 'constants';

class Classes extends React.Component{

    constructor(props){
        super(props);

        this.state = {
            wantCreateAClass: false,
            classNameChosen: "",
            classIdNewClass: "",
            studentsForNewClass: [],
            students: [     //We have here the list of all the students of the school
                {
                    id: "djdjsjjs",
                    name: "Aldo",
                    surname: "Brocchi",
                    classId: "aaa"
                },
                {
                    id: "ssssjs",
                    name: "Giorgia",
                    surname: "Bassi",
                    classId: "aaa"
                },
                {
                    id: "ggggggg",
                    name: "Matteo",
                    surname: "Grosso",
                    classId: "bbb"
                },
                {
                    id: "ppppppp",
                    name: "Alberto",
                    surname: "Albertini",
                    classId: "bbb"
                }
            ],
            classes: [
                {
                    classId: "aaa",
                    name: "1A"
                },
                {
                    classId: "bbb",
                    name: "1B"
                }
            ]
        }
    }

    createClass(){


        //Send info to backend here

        //THEN

        this.setState({
            wantCreateAClass: false,
            studentsForNewClass: []
        });

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
                    custom
                    type='checkbox'
                    id= {student.id}
                    label={student.surname + ' ' + student.name + ' ID: ' + student.id}
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
                if(studentSortedClass[student.classId] == null){
                    studentSortedClass[student.classId] = [];
                }
                studentSortedClass[student.classId].push(
                <Accordion.Collapse eventKey={student.classId.toString()}>
                    <Card.Body>Student {studentSortedClass[student.classId].length+1}: Name: {student.name} Surname: {student.surname} ID: {student.id} </Card.Body>
                </Accordion.Collapse>
                );
            });
            let index;
            for(index in studentSortedClass){
                gradesDOM.push(
                <Card>
                    <Card.Header>
                        <Accordion.Toggle as={Button} variant="link" eventKey={index.toString()}>
                            Class Id: {index}
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
                <Form onSubmit={() => this.createClass()}>
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
                    <Button variant="primary" type="submit">
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