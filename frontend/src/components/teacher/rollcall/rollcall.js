import React from 'react';
import {Table, Button, Form, Alert} from 'react-bootstrap';
import styles from './styles.module.css';



export default class Rollcall extends React.Component{

    constructor(props){
        super(props);

        this.state = {
            classAttendance: this.props.classAttendance,
            classId: this.props.classId,
            classStudents: [],
            studentAbsenceStates: this.props.classAttendance.map(a => {
                return {
                    studentId: a.id,
                    state: a.events.some(e => e.event === 'absence'),
                    modified: false
                };
            }),
            wantEditCheckboxes: false,
            success: '',
            warning: '',
            error: ''
        }
        this.setEditCheckboxes = this.setEditCheckboxes.bind(this);
    }

    setEditCheckboxes(){
        this.setState({wantEditCheckboxes: !this.state.wantEditCheckboxes});
    }

    async componentDidMount(){
        if(this.state.classId !== ''){
            await this.getClassStudents();
        }
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
            const sorted = json.students.sort((a, b) => {
                return a.surname.localeCompare(b.surname) || a.name.localeCompare(b.name)
            });
            this.setState({
                classStudents: sorted
            });
        } catch(e){
            this.setState({
                success: '',
                warning: '',
                error: e
            });
        }
    }

    onCheckChanged(e){
        var i;
        let vecToUpdate = this.state.studentAbsenceStates;
        for(i=0; i<this.state.studentAbsenceStates.length; i++){
            if(e.target.id === this.state.studentAbsenceStates[i].studentId){
                break;
            }
        }
        vecToUpdate[i].state = !vecToUpdate[i].state;
        vecToUpdate[i].modified = !vecToUpdate[i].modified;
        this.setState({
            studentAbsenceStates: vecToUpdate
        });
    }

    createStudentRows(){
        
        let renderStudentRows = [];
        let index = 0;
        if(this.state.classStudents.length !== 0){

                renderStudentRows = this.state.classStudents.map( (s) => {

                    for( ; index < this.state.studentAbsenceStates.length; index++){
                        if(this.state.studentAbsenceStates[index].studentId === s._id){
                            break;
                        }
                    }
                    return( 
                        <tr>
                            <td>{s.surname}</td>
                            <td>{s.name}</td>
                            <td>{s.ssn}</td>
                            <td><Form.Check type="checkbox" id={s._id} onChange={(e) => this.onCheckChanged(e)} checked={(this.state.studentAbsenceStates.find(abs => abs.studentId === s._id) || {}).state} disabled={!this.state.wantEditCheckboxes}/></td>
                    </tr>);
                });
        }
        return renderStudentRows;
    }

    discardChanges = (e) =>{
        
        let vecToUpdate = this.state.studentAbsenceStates;
        for(var index in vecToUpdate){
            if(vecToUpdate[index].modified === true){
                vecToUpdate[index].state = !vecToUpdate[index].state;
                vecToUpdate[index].modified = false;
            }
        }
        this.setState({
            studentAbsenceStates: vecToUpdate,
            wantEditCheckboxes: false
        });
    }

    async saveChanges(){
        let n_modified = 0;
        for(var index in this.state.studentAbsenceStates){
            if(this.state.studentAbsenceStates[index].modified === true){
                n_modified++;
            }
        }
        if(n_modified === 0){
            this.setState({
                success: '',
                warning: 'No student to be updated.',
                error: ''
            });
            this.setState({
                wantEditCheckboxes: false
            });
        } else {
            let vectorToSend = [];
            this.state.studentAbsenceStates.forEach(s => {
                vectorToSend.push({
                        studentId: s.studentId,  //s.state === true if student is absent
                        present: s.state === true ? false : true
                });
            });
            await this.pushInfoToDb(vectorToSend);
            let unsetModificationFlags = this.state.studentAbsenceStates;
            for(let i in unsetModificationFlags){
                unsetModificationFlags[i].modified = false;
            }
            this.setState({
                wantEditCheckboxes: false,
                studentAbsenceStates: unsetModificationFlags
            });
            window.location.reload();
            this.props.updateClassAttendanceOnParent();
        }
    }


    async pushInfoToDb(vectorToSend){
        try {
            const url = 'http://localhost:3000/rollcall';
            const jsonToSend = JSON.stringify({
                info: vectorToSend
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
                    warning:'',
                    error: 'Ops! Internal error. Please retry!'
                });
            } else {
                this.setState({
                    success: 'Rollcall successfully recorded.',
                    warning:'',
                    error: ''
                });
            }
        } catch (err) {
            this.setState({
                success: '',
                warning:'',
                error: err
            });
        }
    }

    render(){

        let renderStudentRows = [];
        renderStudentRows = this.createStudentRows();

        return(
            <div>
                <h1>Attendances</h1>
                <p>This section is to be used to call the roll. Only the teacher of the first hour is allowed to access this page. Changes (in case of mistakes or omissions) are allowed <i>throughout the day</i>.<br />Please <u>do not</u> use this section to update student attendance in the wake of a late-entrance or early-exit. In those cases, use the corresponding section.</p><br />
                {this.state.success !== '' && this.state.warning === '' && this.state.error === '' &&
                    <Alert variant='success'>{this.state.success}</Alert>
                }
                {this.state.success === '' && this.state.warning !== '' && this.state.error === '' &&
                    <Alert variant='warning'>{this.state.warning}</Alert>
                }
                {this.state.success === '' && this.state.warning === '' && this.state.error !== '' &&
                    <Alert variant='danger'>{this.state.error}</Alert>
                }
                {this.state.wantEditCheckboxes === false && (<Button variant="primary" onClick={() => this.setEditCheckboxes()}>Edit</Button>)}
                {this.state.wantEditCheckboxes === true && (
                <div>
                    <Button variant="primary" onClick={() => this.saveChanges()}>Save Changes</Button>
                    <Button className={styles.buttonStyle} variant="danger" onClick={(e) => this.discardChanges(e)}>Discard Changes</Button>
                </div>
                )}<br></br>
                <br></br>
                <Table responsive>
                    <thead>
                        <tr>
                            <th>Surname</th>
                            <th>Name</th>
                            <th>SSN</th>
                            <th>Absence</th>
                        </tr>
                    </thead>
                    <tbody>
                        {renderStudentRows.map(s => {
                            return s;
                        })}
                    </tbody>
                </Table>
            </div>
        );
    }
}