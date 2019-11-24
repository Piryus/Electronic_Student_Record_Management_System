import React from 'react';
import {Button, Form, Dropdown} from 'react-bootstrap';
import 'moment/locale/it.js';
import { DatePicker, DatePickerInput } from 'rc-datepicker';
import 'rc-datepicker/lib/style.css';
import styles from '../student-grades-summary/styles.module.css';



export default class Assignments extends React.Component{


    constructor(props){
        super(props);

        var today = new Date();
        var dd = String(today.getDate()).padStart(2, '0');
        var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
        var yyyy = today.getFullYear();

        today = yyyy + '-' + mm + '-' + dd;

        this.state = {
            wantAddAssignment: false,
            subjects: this.props.subjects,
            selectedSubject: 'Select a Subject',
            selectedDate: today,
            currentDay: today,
            description: '',
            selectedWeekhour: null,
        }

    }

    hourTable = ["08", "09", "10", "11", "12", "13"];


    showFormToAddAssignment(){
        this.setState({wantAddAssignment: true});
    }

    async saveAssignmentIntoDb(day, hour){
        let effectiveHour = this.hourTable[hour];
        try{
            const url = 'http://localhost:3000/assignments';
            const date = new Date(this.state.selectedDate + 'T' + effectiveHour + ':00:00'); //Funziona
            const jsonToSend = JSON.stringify({
                subject: this.state.selectedSubject,
                description: this.state.description,
                due: date
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
                alert('Ops! Internal error. Please retry!');
            } else{
                alert('The Assignment has been successfully recorded.');
            }
        } catch(err){
            alert(err);
        }
     
    }


    async saveChanges(event){
        event.preventDefault();
        if(this.state.selectedSubject === 'Select a Subject'){
            alert('Please select a subject.');
        } else if(this.state.description === ''){
            alert('Please enter a description');
        } else {
            let currentDay = this.state.currentDay.split('-');
            let chosenDay = this.state.selectedDate.split('-');
            if(chosenDay[0] < currentDay[0] ) {
                alert('Please select a date starting tomorrow.');
            } else if(chosenDay[1] < currentDay[1]){
                alert('Please select a date starting tomorrow.');
            } else if(chosenDay[2] <= currentDay[2]){
                alert('Please select a date starting tomorrow.');
            } else{
                let day = new Date(this.state.selectedDate).getDay() -1;
                let toSplit;
                let hour = '';
                this.props.timetable.forEach((t) =>{
                    if(t.subject === this.state.selectedSubject && hour === ''){
                        toSplit = t.weekhour.split('_');
                        hour = toSplit[1];
                    }
                });
                await this.saveAssignmentIntoDb(day, hour);
                this.setState({
                    wantAddAssignment: false,
                    selectedSubject: 'Select a Subject',
                    description: '',
                    selectedWeekhour: null,
                });
            }
        }
    }

    onChange = (jsDate, dateString) => {
        let date = dateString.split('T');
        this.setState({selectedDate: date[0]});
    }

    render(){

        let renderDropDownItem = [];
        for(let index in this.state.subjects){
            renderDropDownItem.push(
                <Dropdown.Item onClick={() => this.setState({selectedSubject: index})}>{index}</Dropdown.Item>
            );
        }

        return (
            <div>
                <h1>Assignments</h1>
                {this.state.wantAddAssignment === false &&(
                    //We should display here already recorded assignments
                    <div>
                        <p>Display Assignments here grouped by subject</p><br></br>
                        <Button variant="primary" onClick={() => this.showFormToAddAssignment()}>Add an Assignment</Button>
                    </div>
                )}
                {this.state.wantAddAssignment === true &&(
                    <div>
                        <p>Complete the form below to add an Assignment</p><br></br>
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
                                </Dropdown>
                            </Form.Group>
                            <Form.Group>
                                <Form.Label>
                                    Date:
                                </Form.Label>
                                <DatePickerInput
                                    onChange={this.onChange}
                                    value={this.state.selectedDate}
                                />
                            </Form.Group>
                            <Form.Group>
                                <Form.Label>
                                    Description:
                                </Form.Label>
                                <Form.Control placeholder="Insert a description here." as="textarea" rows="3" onChange={(e) => this.setState({description: e.target.value}) }/>
                            </Form.Group>
                            <Button  onClick={(e) => this.saveChanges(e)}  type="primary">Save</Button>
                        </Form>
                    </div>
                )}
            </div>
        );
    }
}