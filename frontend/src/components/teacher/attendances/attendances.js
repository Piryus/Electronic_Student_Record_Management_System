import React from 'react';
import {Table, Button, Form} from 'react-bootstrap';
import styles from './styles.module.css';



export default class Attendances extends React.Component{

    constructor(props){
        super(props);

        this.state = {
            classAttendance: this.props.classAttendance,
            classId: this.props.classId,
            classStudents: [],
            wantEditCheckboxes: false
        }
        this.setEditCheckboxes = this.setEditCheckboxes.bind(this);
    }

    setEditCheckboxes(){
        this.setState({wantEditCheckboxes: !this.state.wantEditCheckboxes});
    }

    async componentDidMount(){
        await this.getClassStudents();
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
                classStudents: json.students,
            });
        } catch(e){
            alert(e);
        }
    }

    createStudentRows(){
        let renderStudentRows = [];
        if(this.state.classStudents.length !== 0){
                renderStudentRows = this.state.classStudents.map( (s) => {
                    return( 
                        <tr>
                            <td>{s.surname}</td>
                            <td>{s.name}</td>
                            <td>{s.ssn}</td>
                            <td><Form.Check type="checkbox" disabled={!this.state.wantEditCheckboxes}/></td>
                            <td><Form.Check type="checkbox" disabled={!this.state.wantEditCheckboxes}/></td>
                            <td><Form.Check type="checkbox" disabled={!this.state.wantEditCheckboxes}/></td>
                    </tr>);
                });
        }
        return renderStudentRows;
    }

    render(){

        let renderStudentRows = [];
        renderStudentRows = this.createStudentRows();

        return(
            <div>
                <h1>Attendances</h1>
                {this.state.wantEditCheckboxes === false && (<Button variant="primary" onClick={() => this.setEditCheckboxes()}>Edit</Button>)}
                {this.state.wantEditCheckboxes === true && (
                <div>
                    <Button variant="primary" onClick={() => this.saveChanges()}>Save Changes</Button>
                    <Button className={styles.buttonStyle} variant="danger" onClick={() => this.discardChanges()}>Discard Changes</Button>
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
                            <th>Late-Entrance</th>
                            <th>Early-Exit</th>
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