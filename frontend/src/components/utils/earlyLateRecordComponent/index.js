import React from 'react';
import SectionHeader from '../section-header';
import Select from 'react-select';
import {Button, Table, Form, FormControl, InputGroup} from 'react-bootstrap';
import styles from './styles.module.css';




export default class EarlyLateRecordComponent extends React.Component{

    constructor(props){
        super(props);

        this.state = {
            classId: this.props.classId,
            classStudents: [],
            selectedStudent: '',
            selectedhh: '',
            selectedmm: '',
            addedStudents: [],
            searchOptions: [],
        }

    }

    async componentDidMount(){
        if(this.state.classId !== ''){
            await this.getClassStudents();
            this.computeSearchOptions();
        }
    }

    computeSearchOptions() {
        let options = [];
        this.state.classStudents.map((student) => {
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


    async getClassStudents(){
        try{
            const url = 'http://localhost:3000/students?classId=' + this.state.classId;
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
                classStudents: json.students
            });
        } catch(e){
            alert(e);
        }
    }

    addStudent(){
        if(this.state.selectedStudent === ''){
            alert('Please select a student.');
        } else if(isNaN(this.state.selectedhh)){
            alert('Please insert a valid hour.');
        } else if(this.state.selectedhh === ''){
            alert('Please insert a valid hour.');
        } else if(parseInt(this.state.selectedhh)<8 || parseInt(this.state.selectedhh)>14){
            alert('Please insert a valid hour.');
        }  else if(isNaN(this.state.selectedmm)){
            alert('Please insert valid minutes.');
        } else if(this.state.selectedhh === ''){
            alert('Please insert valid minutes.');
        } else if(parseInt(this.state.selectedhh)<0 || parseInt(this.state.selectedhh)>59){
            alert('Please insert valid minutes.');
        } else{
            let addedStudents = this.state.addedStudents;
            let alreadyExists = addedStudents.find(s => s.student._id.toString() === this.state.selectedStudent.value._id.toString());
            if(alreadyExists !== undefined && alreadyExists !== null){
                alert('Student already added to list');
            } else {
                addedStudents.push({
                    student: this.state.selectedStudent.value,
                    hh: this.state.selectedhh,
                    mm: this.state.selectedmm
                });
                //Sort eventually here
                this.setState({
                    addedStudents: addedStudents,
                    selectedStudent: '',
                    selectedhh: '',
                    selectedmm: ''
                });
            }
 
        }

    }

    async saveChanges(){
        
    }

    discardChanges(){
        this.setState({
            addedStudents: [],
            selectedStudent: '',
            selectedhh: '',
            selectedmm: ''
        });
    }

    removeItem(id){
        let addedStudents = this.state.addedStudents.filter(s => s.student._id !== id);
        this.setState({addedStudents: addedStudents});
    }


    render(){

        return(
            <div>
                {this.props.type === 'late-entry' && (
                    <SectionHeader>Late Entry</SectionHeader>
                )}
                {this.props.type === 'early-exit' &&(
                    <SectionHeader>Early Exit</SectionHeader>
                )}
                <Form >
                    <Form.Group>
                        <Form.Label>Search a Student</Form.Label>
                        <Select
                            value={this.state.selectedStudent}
                            options={this.state.searchOptions}
                            onChange={(selectedStudent) => this.setState({selectedStudent})}
                        /><br></br>
                    </Form.Group>
                    <Form.Group>
                        <InputGroup responsive>
                            <InputGroup.Prepend>
                                <InputGroup.Text>Time:</InputGroup.Text>
                            </InputGroup.Prepend>
                            <FormControl placeholder='hh' value={this.state.selectedhh} onChange={(e) => this.setState({selectedhh: e.target.value})}/>
                            <FormControl placeholder='mm' value={this.state.selectedmm} onChange={(e) => this.setState({selectedmm: e.target.value})}/>
                        </InputGroup>
                    </Form.Group>
                    
                    <Button variant="primary" onClick={() => this.addStudent()}>Add Student</Button><br></br><br></br>
                    <Button variant="outline-success" onClick={() => this.saveChanges()}>Save</Button>
                    <Button variant="danger" className={styles.dangerButton} onClick={() => this.discardChanges()}>Discard</Button>


                </Form><br></br>
                <Table responsive>
                        <thead>
                            <tr>
                                <th>Surname</th>
                                <th>Name</th>
                                <th>SSN</th>
                                <th>Hour</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.state.addedStudents.map((s, idx) => {
                            return (<tr key={idx}>
                                    <td>{this.state.addedStudents[idx].student.surname}</td>
                                    <td>{this.state.addedStudents[idx].student.name}</td>
                                    <td>{this.state.addedStudents[idx].student.ssn}</td>
                                    <td>{this.state.addedStudents[idx].hh +':'+this.state.addedStudents[idx].mm}</td>
                                    <td><Button variant="danger" size="sm" onClick={() => this.removeItem(this.state.addedStudents[idx].student._id)}>Remove</Button></td>
                                </tr>);
                            })}
                        </tbody>
                    </Table>
            </div>
        );
    }
}