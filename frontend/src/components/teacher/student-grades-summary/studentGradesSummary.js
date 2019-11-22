import React from 'react';
import Select from 'react-select';
import {Button, Dropdown, DropdownButton, Card, Accordion, Form} from 'react-bootstrap';
import styles from './styles.module.css';



export default class StudentGradesSummary extends React.Component{

    grades = [
        "0",
        "0+",
        "0.5",
        "1-",
        "1",
        "1+",
        "1.5",
        "2-",
        "2",
        "2+",
        "2.5",
        "3-",
        "3",
        "3+",
        "3.5",
        "4-",
        "4",
        "4+",
        "4.5",
        "5-",
        "5",
        "5+",
        "5.5",
        "6-",
        "6",
        "6+",
        "6.5",
        "7-",
        "7",
        "7+",
        "7.5",
        "8-",
        "8",
        "8+",
        "8.5",
        "9-",
        "9",
        "9+",
        "9.5",
        "10-",
        "10",
        "10 cum laude"
    ];

    constructor(props){
        super(props);


        this.state = {
            wantAddAGrade: false,
            searchOptions: [],
            selectedStudent: '',
            selectedSubject: 'Select a subject', 
            selectedGrade: 'Select a grade',
            students: this.props.students,
            subjects: this.props.subjects
        }
    }

    componentDidMount(){
        this.computeSearchOptions();
    }



    computeSearchOptions() {
        let options = [];
        this.state.students.map((student) => {
            let option = {
                value: student,
                label: student.name + ' ' + student.surname + ' <' + student.ssn + '>'
            };
            options.push(option);
        });
        this.setState({
            searchOptions: options
        });
    }

    showFormToAddAGrade(){
        if(this.state.selectedStudent === ''){
            alert('Please select a student first.');
        }
        else{
            this.setState({wantAddAGrade: true});
        }
    }

    async storeInDb(){
        const url = 'http://localhost:3000/student/addGrade';
        const jsonToSend = JSON.stringify({
            id: this.state.selectedStudent.value._id,
            subject: this.state.selectedSubject,
            grade: this.state.selectedGrade
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
            alert('Internal error occured while saving the grade. Please retry.');
        } else{
            alert('The grade has been recorded successfully!');
        }
    }

    async saveGrade(){
        if(this.state.selectedStudent=== '' ){
            alert('Please select a student.');
        }
        else if(this.state.selectedGrade === 'Select a grade' || this.state.selectedGrade === ''){
            alert('Please select a grade.');
        } else if(this.state.selectedSubject === 'Select a subject' || this.state.selectedSubject === ''){
            alert('Please select a subject');
        } else{
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


    render(){

        //Building of Grades and Subejects DOM
        let gradesSortedTopic = [];
        let gradesDOM = [];
        if (this.state.selectedStudent !== '') {
            this.state.selectedStudent.value.grades.map((grade) => {
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
                if(index in this.state.subjects){
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
        }
        let renderDropDownItem = [];
        for(let index in this.state.subjects){
            renderDropDownItem.push(
                <Dropdown.Item onClick={() => this.setState({selectedSubject: index})}>{index}</Dropdown.Item>
            );
        }

        let renderGradesDropdownItems = [];
        this.grades.forEach((grade) => {
            renderGradesDropdownItems.push(
                <Dropdown.Item onClick={() => this.setState({selectedGrade: grade})}>{grade}</Dropdown.Item>
            );
        });

        return(
            <div>
                <h2>Student Grades</h2><br></br>
                <Form.Group>
                        <Form.Label>Select a Student:</Form.Label>
                        <Select
                            value={this.state.selectedStudent}
                            options={this.state.searchOptions}
                            onChange={(value) => this.setState({selectedStudent: value})}
                        />
                    </Form.Group><br></br>
                {this.state.wantAddAGrade === false &&(
                <div>
                    <Accordion defaultActiveKey="0">
                        {gradesDOM.length === 0 && this.state.selectedStudent !== '' && (
                            <p>There are not avaiable grades for this student.</p>
                        )}
                        {gradesDOM.map((subject) => {
                            return subject;
                        })}
                    </Accordion><br></br>
                    <Button variant="primary" onClick={() => this.showFormToAddAGrade()}>Add a Grade</Button>
                </div>
                )}
                {this.state.wantAddAGrade === true &&(
                <Form>
                    <Form.Group>
                    <Form.Label>Subject: </Form.Label>
                    <Dropdown>
                        <Dropdown.Toggle variant="primary" id="dropdown-basic">
                            {this.state.selectedSubject}
                        </Dropdown.Toggle>

                        <Dropdown.Menu className={styles.dropdownMenu}>
                            {renderDropDownItem.map((item) => {
                                return item;
                            })}
                        </Dropdown.Menu>
                    </Dropdown><br></br>
                    </Form.Group>
                    <Form.Group>
                    <Form.Label>Grade: </Form.Label>
                    <Dropdown>
                        <Dropdown.Toggle variant="primary" id="dropdown-basic">
                            {this.state.selectedGrade}
                        </Dropdown.Toggle>
                        <Dropdown.Menu className={styles.dropdownMenu}>
                            {renderGradesDropdownItems.map((item) => {
                                return item;
                            })}
                        </Dropdown.Menu>
                    </Dropdown><br></br>
                    </Form.Group>
                    <Button variant="primary" onClick={() => this.saveGrade()}>Save</Button>
                    </Form>
                )}
            </div>
        );
    }
}