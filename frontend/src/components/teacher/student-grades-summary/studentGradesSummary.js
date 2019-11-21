import React from 'react';
import DropdownToggle from 'react-bootstrap/DropdownToggle';
import DropdownMenu from 'react-bootstrap/DropdownMenu';
import {Button, Dropdown, Card, Accordion} from 'react-bootstrap';



export default class StudentGradesSummary extends React.Component{

    constructor(props){
        super(props);

        const selectedStudent = this.props.students[0];

        this.state = {
            wantAddAGrade: false,
            studentSelected: '',
            selectedSubject: '',
            studentSelected: selectedStudent,
            students: this.props.students
        }
    }

    selectStudent(e, s){
        this.setState({
            studentSelected: s
        });
    }

    generateStudentItems(){
        let studentNotSelected = [];
        if (this.props.type === 'teacher-grades') {
            this.state.students.map((student) => {
                if (student._id !== this.state.studentSelected._id)
                    studentNotSelected.push(
                        <Dropdown.Item key={student._id} onClick={(e) => this.selectStudent(e, student)}>
                            {[student.name, student.surname].join(' ')}
                        </Dropdown.Item>);
            });
        }

        return studentNotSelected;
    }

    render(){
        let studentNotSelected = this.generateStudentItems();

        //Building of Grades and Subejects DOM
        let gradesSortedTopic = [];
        let gradesDOM = [];
        if (this.state.studentSelected !== null) {
            this.state.studentSelected.grades.map((grade) => {
                if (gradesSortedTopic[grade.subject] == null) {
                   gradesSortedTopic[grade.subject] = [];
                }
                let date = grade.date.split("T");
                gradesSortedTopic[grade.subject].push(
                    <Accordion.Collapse eventKey={grade.subject}>
                        <Card.Body>Grade {gradesSortedTopic[grade.subject].length + 1}: {grade.value} Date
                            : {date[0]}</Card.Body>
                    </Accordion.Collapse>
                );
            });
            let index;
            for (index in gradesSortedTopic) {
                gradesDOM.push(
                    <Card>
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


        return(
            <div>
                <Dropdown className={'ml-auto'}>
                    <DropdownToggle>
                        {this.state.studentSelected.name + ' ' + this.state.studentSelected.surname}
                    </DropdownToggle>
                        <DropdownMenu>
                            {studentNotSelected.map((student) =>{
                                return student;
                            })}
                        </DropdownMenu>
                </Dropdown><br/>
                {this.state.wantAddAGrade === false &&(
                <div>
                    <h2>Grades</h2>
                    <Accordion defaultActiveKey="0">
                        {gradesDOM.map((subject) => {
                            return subject;
                        })}
                    </Accordion><br></br>
                    <Button variant="primary">Add a Grade</Button>
                </div>
                )}
            </div>
        );
    }
}