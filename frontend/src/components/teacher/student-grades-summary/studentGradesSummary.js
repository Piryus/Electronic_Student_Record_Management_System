import React from 'react';
import Select from 'react-select';
import {Button, Dropdown, DropdownButton, Card, Accordion, Form} from 'react-bootstrap';
import styles from './styles.module.css';



export default class StudentGradesSummary extends React.Component{

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
        const url = 'http://localhost:3000/grades';
        const jsonToSend = JSON.stringify({
            subject: this.state.selectedSubject,
            grades: [
                { studentId: this.state.selectedStudent.value._id, grade: this.state.selectedGrade }
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
            alert('Please insert a grade.');
        } else if(this.state.selectedSubject === 'Select a subject' || this.state.selectedSubject === ''){
            alert('Please select a subject');
        } else if(/^([0-9]\+|([1-9]|10)\-|[0-9](\.5|( | and )1\/2)|0\/1|1\/2|2\/3|3\/4|4\/5|5\/6|6\/7|7\/8|8\/9|9\/10|10(l|L| cum laude))$/.test(this.state.selectedGrade) === false){
            alert('Grade format not valid. Please insert a correct grade.');
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
                            <p>There are not available grades for this student.</p>
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
                    {/* <Form.Group>
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
                    </Form.Group> */}
                    <Form.Group controlId="formBasicEmail">
                        <Form.Label>Grade: </Form.Label>
                        <Form.Control type="text" placeholder="Grade examples: 7.5, 9-, 8+, 10 cum laude" onChange={(e) => this.setState({selectedGrade: e.target.value})}/>
                    </Form.Group>
                    <Button variant="primary" onClick={() => this.saveGrade()}>Save</Button>
                    </Form>
                )}
            </div>
        );
    }
}