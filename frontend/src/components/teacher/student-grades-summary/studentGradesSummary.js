import React from 'react';
import Select from 'react-select';
import {Accordion, Alert, Button, Card, Container, Dropdown, Form} from 'react-bootstrap';
import styles from './styles.module.css';
import SectionHeader from "../../utils/section-header";
import moment from 'moment';
import {DatePickerInput} from "rc-datepicker";
import 'rc-datepicker/lib/style.css';

export default class StudentGradesSummary extends React.Component {

    constructor(props) {
        super(props);

        let sub_classes = [];
        for(var i in this.props.subjects){
            let elems = this.props.timetable.filter(t => t.subject===i);
            sub_classes[i] = elems;
        }

        console.log(sub_classes);


        this.state = {
            wantAddAGrade: false,
            searchOptions: [],
            selectedStudent: '',
            selectedSubject: 'Select a subject',
            selectedGrade: 'Select a grade',
            gradeDescription: '',
            gradeDate: new Date(),
            selectedClass: '',
            selectedClassId: '',
            students: this.props.students,
            studentsForSelectedClass: [],
            subjects: this.props.subjects,
            sub_classes: sub_classes,
            classes: [],
            success: '',
            error: '',
            warning: ''
        }

        console.log(sub_classes);
    }

    async componentDidMount() {
        this.computeSearchOptions();
        if (this.state.wantAddAGrade === true) {
            await this.getAllClasses();
        }
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
        let response = await fetch(url, options);
        const json = await response.json();
        this.setState({classes: this.state.classes.concat(json.classes)});
    };

    computeSearchOptions() {
        let options = [];
        if (this.state.wantAddAGrade === true) {
            this.state.studentsForSelectedClass.forEach((student) => {
                let option = {
                    value: student,
                    label: student.name + ' ' + student.surname + ' <' + student.ssn + '>'
                };
                options.push(option);
            });
        } else {
            this.state.students.forEach((student) => {
                let option = {
                    value: student,
                    label: student.name + ' ' + student.surname + ' <' + student.ssn + '>'
                };
                options.push(option);
            });
        }

        this.setState({
            searchOptions: options
        });
    }

    async showFormToAddAGrade() {
        await this.getAllClasses();
        this.setState({
            wantAddAGrade: true,
            selectedStudent: '',
            searchOptions: []
        });
    }

    async storeInDb() {
        const url = 'http://localhost:3000/grades';
        const jsonToSend = JSON.stringify({
            subject: this.state.selectedSubject,
            description: this.state.gradeDescription,
            date: this.state.gradeDate,
            grades: [{
                studentId: this.state.selectedStudent.value._id,
                grade: this.state.selectedGrade
            }]
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
                error: 'Internal error occurred while saving the grade. Please retry.'
            })
        } else {
            this.setState({
                success: 'The grade has been recorded successfully!',
                warning: '',
                error: ''
            })
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
            this.setState({
                success: '',
                warning: '',
                error: e
            })
        }
    }

    async saveGrade() {
        if (this.state.selectedSubject === 'Select a subject' || this.state.selectedSubject === '') {
            this.setState({
                warning: 'Please select a subject',
                success: '',
                error: ''
            });
        } else if (this.state.selectedStudent === '') {
            this.setState({
                warning: 'Please select a student.',
                success: '',
                error: ''
            });
        } else if (this.state.selectedGrade === 'Select a grade' || this.state.selectedGrade === '') {
            this.setState({
                warning: 'Please insert a grade.',
                success: '',
                error: ''
            });
        } else if (this.state.gradeDescription === '') {
            this.setState({
                warning: 'Please insert a description.',
                success: '',
                error: ''
            });
        } else if (moment(this.state.gradeDate).isAfter(new Date(), 'day')) {
            this.setState({
                warning: 'Please insert a valid date.',
                success: '',
                error: ''
            });
        } else if (/^([0-9]\+?|([1-9]|10)-|[0-9](\.5|( | and )1\/2)|0\/1|1\/2|2\/3|3\/4|4\/5|5\/6|6\/7|7\/8|8\/9|9\/10|10(l|L| cum laude)?)$/.test(this.state.selectedGrade) === false) {
            this.setState({
                warning: 'Grade format not valid. Please insert a correct grade.',
                success: '',
                error: ''
            });
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
                this.setState({
                    warning: 'Denied action. You have not yet had lessons for this subject this week.',
                    success: '',
                    error: ''
                });
            } else {
                //Ok I can save the grade into db
                await this.storeInDb();
                //END
                this.setState({
                    wantAddAGrade: false,
                    selectedSubject: 'Select a subject',
                    selectedGrade: 'Select a grade',
                    gradeDescription: '',
                    gradeDate: new Date()
                });
                window.location.reload(false);
            }
        }
    }


    render() {

        //Building of Grades and Subejects DOM
        let gradesSortedTopic = [];
        let gradesDOM = [];
        if (this.state.selectedStudent !== '') {
            this.state.selectedStudent.value.grades.forEach((grade) => {
                if(this.state.sub_classes[grade.subject]!== undefined){
                    let f = this.state.sub_classes[grade.subject].find(e => e.classId.toString() === this.state.selectedStudent.value.classId.toString());
                    if(f !== undefined){
                        if (gradesSortedTopic[grade.subject] == null) {
                            gradesSortedTopic[grade.subject] = [];
                        }
                        let date = grade.date.split("T");
                        let gradeSubject;
                        if (grade.description !== undefined) {
                            gradeSubject = `${grade.description}`;
                        } else {
                            gradeSubject = `Grade ${gradesSortedTopic[grade.subject].length + 1}`;
                        }
                        gradesSortedTopic[grade.subject].push(
                            <Accordion.Collapse key={grade.subject + grade.date + grade.value} eventKey={grade.subject}>
                                <Card.Body>{gradeSubject} - {moment(date[0]).format('DD/MM/YYYY')} : <b>{grade.value}</b></Card.Body>
                            </Accordion.Collapse>
                        );
                    }
                }

            });
            let index;
            for (index in gradesSortedTopic) {
                if (index in this.state.subjects) {
                    gradesDOM.push(
                        <Card key={index}>
                            <Card.Header>
                                <Accordion.Toggle as={Button} variant="link" eventKey={index}>
                                    {index}
                                </Accordion.Toggle>
                            </Card.Header>
                            {gradesSortedTopic[index].map((grade) => {
                                return grade;
                            })}
                        </Card>
                    );
                }
            }
        }
        let renderDropDownItem = [];
        if (this.state.wantAddAGrade === true) {
            for (let index in this.state.subjects) {
                let element = this.state.classes.find((c) => {
                    return c._id.toString() === this.state.subjects[index].class
                });
                renderDropDownItem.push(
                    <Dropdown.Item key={index} onClick={async () => {
                        this.setState({
                            selectedSubject: index,
                            selectedClass: element.name,
                            selectedClassId: element._id.toString()
                        });
                        await this.getStudentsForSelectedClass(element._id.toString());
                    }}>{element.name + ' ' + index}</Dropdown.Item>
                );
            }
        }

        return (
            <Container fluid>
                <SectionHeader>Student grades</SectionHeader>
                {this.state.success !== '' && this.state.warning === '' && this.state.error === '' && (
                    <Alert variant="success">{this.state.success}</Alert>
                )}
                {this.state.success === '' && this.state.warning !== '' && this.state.error === '' && (
                    <Alert variant="warning">{this.state.warning}</Alert>
                )}
                {this.state.success === '' && this.state.warning === '' && this.state.error !== '' && (
                    <Alert variant="danger">{this.state.error}</Alert>
                )}
                {this.state.wantAddAGrade === false && (
                    <>
                        <Button variant="primary"
                                onClick={() => this.showFormToAddAGrade()}
                                className="mb-3">
                            New grade
                        </Button>
                        <h6>Look up the grades of a student</h6>
                        <Form.Group>
                            <Select
                                placeholder="Select a student or enter the name of a student..."
                                value={this.state.selectedStudent}
                                options={this.state.searchOptions}
                                onChange={(value) => this.setState({selectedStudent: value})}
                            />
                        </Form.Group>
                        <Accordion defaultActiveKey="0">
                            {gradesDOM.length === 0 && this.state.selectedStudent !== '' && (
                                <p>There are not available grades for this student.</p>
                            )}
                            {gradesDOM.map((subject) => {
                                return subject;
                            })}
                        </Accordion><br></br>
                    </>
                )}
                {this.state.wantAddAGrade === true && (
                    <Form>
                        <Form.Group>
                            <Form.Label>Subject</Form.Label>
                            <Dropdown>
                                <Dropdown.Toggle variant="primary" id="dropdown-basic">
                                    {this.state.selectedClass + ' ' + this.state.selectedSubject}
                                </Dropdown.Toggle>

                                <Dropdown.Menu className={styles.dropdownMenu}>
                                    {renderDropDownItem.map((item) => {
                                        return item;
                                    })}
                                </Dropdown.Menu>
                            </Dropdown>
                        </Form.Group>
                        {this.state.searchOptions.length !== 0 &&
                        <Form.Group>
                            <Form.Label>Student</Form.Label>
                            <Select
                                value={this.state.selectedStudent}
                                options={this.state.searchOptions}
                                onChange={(value) => this.setState({selectedStudent: value})}
                            />
                        </Form.Group>
                        }
                        <Form.Group>
                            <Form.Label>Grade</Form.Label>
                            <Form.Control type="text" placeholder="Grade examples: 7.5, 9-, 8+, 10 cum laude"
                                          onChange={(e) => this.setState({selectedGrade: e.target.value})}/>
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Description</Form.Label>
                            <Form.Control type="text" placeholder="Knowledge test on chapter 4"
                                          onChange={(e) => this.setState({gradeDescription: e.target.value})}/>
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Date</Form.Label>
                            <DatePickerInput
                                value={this.state.gradeDate}
                                onChange={(date) => {console.log(date); this.setState({gradeDate: date})}}
                            />
                        </Form.Group>
                        <Button variant="primary" onClick={() => this.saveGrade()}>Save</Button>
                    </Form>
                )}
            </Container>
        );
    }
}