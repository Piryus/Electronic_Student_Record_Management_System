import React from 'react';
import Select from 'react-select';
import {Accordion, Button, Card, Container, Form} from 'react-bootstrap';
import SectionHeader from "../../utils/section-header";

export default class StudentGradesSummary extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            wantAddAGrade: false,
            studentsSearchOptions: [],
            selectedStudent: undefined,
            selectedSubject: 'Select a subject',
            selectedGrade: 'Select a grade',
            selectedClass: '',
            selectedClassId: '',
            students: this.props.students,
            studentsForSelectedClass: [],
            subjects: this.props.subjects,
            classes: []
        }
    }

    async componentDidMount() {
        const studentsSearchOptions = this.getStudentsSearchOptions();
        const classes = await this.getAllClasses();
        this.setState({
            classes,
            studentsSearchOptions
        });
    }

    async getAllClasses() {
        const url = 'http://localhost:3000/classes';
        const options = {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            credentials: 'include',
        };
        const response = await fetch(url, options);
        const json = await response.json();
        return json.classes;
    };

    getStudentsSearchOptions() {
        let options = [];
        if (this.state.wantAddAGrade === true) {
            this.state.studentsForSelectedClass.map((student) => {
                let option = {
                    value: student,
                    label: student.name + ' ' + student.surname + ' <' + student.ssn + '>'
                };
                options.push(option);
            });
        } else {
            this.state.students.map((student) => {
                let option = {
                    value: student,
                    label: student.name + ' ' + student.surname + ' <' + student.ssn + '>'
                };
                options.push(option);
            });
        }
        return options;
    }

    async storeInDb() {
        const url = 'http://localhost:3000/grades';
        const jsonToSend = JSON.stringify({
            subject: this.state.selectedSubject,
            grades: [
                {studentId: this.state.selectedStudent.value._id, grade: this.state.selectedGrade}
            ]
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
            alert('Internal error occurred while saving the grade. Please retry.');
        } else {
            alert('The grade has been recorded successfully!');
        }
    }

    async getStudentsForSelectedClass(id) {
        try {
            const url = 'http://localhost:3000/students?classId=' + id;
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
                studentsForSelectedClass: json.students,
            });
            this.computeSearchOptions();
        } catch (e) {
            console.log(e);
        }
    }

    async saveGrade() {
        if (this.state.selectedSubject === 'Select a subject' || this.state.selectedSubject === '') {
            alert('Please select a subject');
        } else if (this.state.selectedStudent === undefined) {
            alert('Please select a student.');
        } else if (this.state.selectedGrade === 'Select a grade' || this.state.selectedGrade === '') {
            alert('Please insert a grade.');
        } else if (/^([0-9]\+?|([1-9]|10)\-|[0-9](\.5|( | and )1\/2)|0\/1|1\/2|2\/3|3\/4|4\/5|5\/6|6\/7|7\/8|8\/9|9\/10|10(l|L| cum laude)?)$/.test(this.state.selectedGrade) === false) {
            alert('Grade format not valid. Please insert a correct grade.');
        } else {
            //Check if the teacher is inserting the grade in the day he has a lesson for the selected subject for the selected class
            let day = new Date(Date.now()).getNormalizedDay();
            let teacherHadLesson = false;
            let toSplit = [];
            //Get the first day I will have lesson for this subject this week
            this.props.timetable.forEach((t) => {
                if (t.subject === this.state.selectedSubject) {
                    toSplit = t.weekhour.split('_');
                    if (day >= parseInt(toSplit[0])) {
                        teacherHadLesson = true;
                    }
                }
            });
            if (teacherHadLesson === false) {
                alert('Denied action. You have not yet had lessons for this subject this week.');
            } else {
                //Ok I can save the grade into db
                await this.storeInDb();

                //END
                this.setState({
                    wantAddAGrade: false,
                    selectedSubject: 'Select a subject',
                    selectedGrade: 'Select a grade',
                });
                window.location.reload(false);
            }
        }
    }


    render() {

        // let renderDropDownItem = [];
        // for (let subject in this.state.subjects) {
        //     const element = this.state.classes.find((c) => {
        //         if (c._id.toString() === this.state.subjects[subject].class)
        //             return c;
        //     });
        //     renderDropDownItem.push(
        //         <Dropdown.Item onClick={async () => {
        //             this.setState({
        //                 selectedSubject: subject,
        //                 selectedClass: element.name,
        //                 selectedClassId: element._id.toString()
        //             });
        //             await this.getStudentsForSelectedClass(element._id.toString());
        //         }}>{element.name + ' ' + subject}</Dropdown.Item>
        //     );
        // }

        return (
            <Container fluid>
                <SectionHeader>Student grades</SectionHeader>

                <h5>Look up the grades of a student</h5>
                <Form.Group>
                    <Form.Label>Select a student:</Form.Label>
                    <Select
                        value={this.state.selectedStudent}
                        options={this.state.studentsSearchOptions}
                        onChange={(student) => this.setState({selectedStudent: student})}
                    />
                </Form.Group>

                {this.state.selectedStudent !== undefined && <h6>{this.state.selectedStudent.value.name}'s grades:</h6>}

                <Accordion>
                    {this.state.selectedStudent !== undefined && this.state.subjects.map(subject => {
                        let gradeCounter = 0;
                        return (
                            <Card key={subject.subject}>
                                <Card.Header>
                                    <Accordion.Toggle as={Button} variant="link" eventKey={subject.subject}>
                                        {subject.subject}
                                    </Accordion.Toggle>
                                </Card.Header>
                                {this.state.selectedStudent.value.grades.map(grade => {
                                    if (grade.subject === subject.subject) {
                                        gradeCounter++;
                                        return (
                                            <Accordion.Collapse eventKey={grade.subject} key={grade}>
                                                <Card.Body>Grade {gradeCounter}: {grade.value} Date
                                                    : {grade.date.split("T")[0]}</Card.Body>
                                            </Accordion.Collapse>
                                        );
                                    }
                                })}
                                {gradeCounter === 0 &&
                                <Accordion.Collapse eventKey={subject.subject}>
                                    <Card.Body>{this.state.selectedStudent.value.name} doesn't have any registered
                                        grades in {subject.subject}.</Card.Body>
                                </Accordion.Collapse>
                                }
                            </Card>);
                    })
                    }
                </Accordion>

                {/*{this.state.selectedStudent !== undefined &&*/}
                {/*<div>*/}
                {/*    <h5>Add a grade to {this.state.selectedStudent.value.name}</h5>*/}
                {/*    <Form>*/}
                {/*        <Form.Group>*/}
                {/*            <Form.Label>Subject: </Form.Label>*/}
                {/*            <Dropdown>*/}
                {/*                <Dropdown.Toggle variant="primary" id="dropdown-basic">*/}
                {/*                    {this.state.selectedClass + ' ' + this.state.selectedSubject}*/}
                {/*                </Dropdown.Toggle>*/}
                {/*                <Dropdown.Menu style={{'height': '300%', 'overflow-y': 'scroll'}}>*/}
                {/*                    {renderDropDownItem.map((item) => {*/}
                {/*                        return item;*/}
                {/*                    })}*/}
                {/*                </Dropdown.Menu>*/}
                {/*            </Dropdown>*/}
                {/*        </Form.Group>*/}
                {/*        <Form.Group controlId="formBasicEmail">*/}
                {/*            <Form.Label>Grade: </Form.Label>*/}
                {/*            <Form.Control type="text" placeholder="Grade examples: 7.5, 9-, 8+, 10 cum laude"*/}
                {/*                          onChange={(e) => this.setState({selectedGrade: e.target.value})}/>*/}
                {/*        </Form.Group>*/}
                {/*        <Button variant="primary" onClick={() => this.saveGrade()}>Save</Button>*/}
                {/*    </Form>*/}
                {/*</div>*/}
                {/*}*/}
            </Container>
        );
    }
}