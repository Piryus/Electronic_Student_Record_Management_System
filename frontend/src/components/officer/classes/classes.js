import React from 'react';
import styles from './styles.module.css';
import Form from 'react-bootstrap/Form';
import Accordion from "react-bootstrap/Accordion";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";

class Classes extends React.Component {

    constructor(props) {
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

    async componentDidMount() {
        const students = await this.getAllStudents();
        const classes = await this.getClasses();
        this.setState({
            students: students,
            classes: classes,
        });
    }

    async getClasses() {
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
        return json.classes;
    };

    async getAllStudents() {
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
        return json.students;
    }

    async pushClassToDB() {
        const url = 'http://localhost:3000/classes';
        const jsonToSend = JSON.stringify({
            name: this.state.classNameChosen,
            studentIds: this.state.studentsForNewClass
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
            alert('Error! Please insert a class Name');
        } else {
            alert('Class created successfully!');
        }
    }

    async createClass() {

        if (this.state.classNameChosen === "" || this.state.studentsForNewClass.length === 0) {
            alert('Please insert a class name and a student at least.');
        } else {
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
    }

    addStudentToNewClass(e) {
        let values = this.state.studentsForNewClass;
        if (!values.includes(e.target.id)) {
            values.push(e.target.id);
        } else {
            let newVett = values;
            for (var v in values) {
                if (values[v] === e.target.id) {
                    newVett.splice(v, 1);
                    break;
                }
            }
            values = newVett;
        }
        this.setState({studentsForNewClass: values});
    }

    renderStudentsCheckbox() {
        let checkboxToRender = [];
        this.state.students.forEach((student) => {
            checkboxToRender.push(
                <Form.Check
                    type='checkbox'
                    id={student._id.toString()}
                    label={student.surname + ' ' + student.name + ' SSN: ' + student.ssn}
                    onChange={(e) => this.addStudentToNewClass(e)}
                />
            );
        });
        return checkboxToRender;
    }

    render() {
        console.log(this.state.classes);
        console.log(this.state.students);

        let checkboxToRender = this.renderStudentsCheckbox();


        return (
            <div>
                <h1>Classes</h1>
                {this.state.wantCreateAClass === false && (
                    <Accordion className={styles.gradesContainer} defaultActiveKey="0">
                        {
                            this.state.classes.map((class_) => {
                                let studentIndex = 0;
                                return (<Card key={class_.id}>
                                    <Card.Header>
                                        <Accordion.Toggle as={Button} variant="link" eventKey={class_._id}>
                                            {class_.name}
                                        </Accordion.Toggle>
                                    </Card.Header>
                                    {this.state.students.map((student) => {
                                        if (student.classId === class_._id) {
                                            studentIndex++;
                                            return (
                                                <Accordion.Collapse eventKey={class_._id} key={student._id}>
                                                    <Card.Body>Student {studentIndex}: {student.surname} {student.name} SSN: {student.ssn} </Card.Body>
                                                </Accordion.Collapse>
                                            );
                                        }
                                    })}
                                </Card>)
                            })
                        }
                        <br></br>
                        <p className="btn btn-primary bg-blue border-blue ml-3"
                           onClick={() => this.setState({wantCreateAClass: true})} role="button">Create a class</p>
                    </Accordion>)}
                {this.state.wantCreateAClass === true && (
                    <Accordion className={styles.gradesContainer} defaultActiveKey="0">
                        <Form /*onSubmit={() => this.createClass()}*/>
                            <Form.Group controlId="formBasicEmail">
                                <Form.Label>Class name</Form.Label>
                                <Form.Control type="text" placeholder="Class names examples: 1A, 1B, 3C, 5B"
                                              onChange={(e) => this.setState({classNameChosen: e.target.value})}/>
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
        )
            ;
    }
}

export default Classes;