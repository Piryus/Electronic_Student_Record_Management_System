import React from 'react';
import {Button, Table, Form, FormControl, InputGroup} from 'react-bootstrap';
import LectureTopics from '../../teacher/lecture-topics';
import { parse } from 'path';


export default class EarlyLateTable extends React.Component{

    constructor(props){
        super(props);

        let whs = [];
        whs = this.props.timetable.map(t => t.weekhour);
        whs = whs.filter(wh => parseInt(wh.charAt(0))===this.props.now);
        whs = whs.map(dh => parseInt(dh.charAt(2)));

        this.state = {
            classStudents: this.props.classStudents,
            classEvents: [],
            workingHours : whs
        }
    }

    async componentDidMount(){
        await this.getEvents();
    }

    async getEvents(){
        try{
            const url = 'http://localhost:3000/attendance';
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
            
            this.setState({classEvents: json.classAttendance});
        } catch(e){
            alert(e);
        }
    }

    removeItem(id){

    }

    render(){
        return(
            <div>
                <Button variant="outline-primary" onClick={() => this.props.dontWantSeeEvents()}>Add Event</Button><br></br>
                <Table responsive>
                        <thead>
                            <tr>
                                <th>Surname</th>
                                <th>Name</th>
                                <th>SSN</th>
                                <th>{this.props.type === 'late-entrance' ? 'Entrance Hour' : 'Exit Hour'}</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.state.classEvents.map((s, idx) => {
                            let event = this.state.classEvents[idx].events.find(e => {
                                let hour = e.date.split('T');
                                hour = hour[1].split(':');
                                hour = parseInt(hour[0]) - 8;
                                return e.event === this.props.type && this.state.workingHours.includes(hour);
                            });
                            console.log(this.state.workingHours);
                            return event === undefined ? null : (<tr key={idx}>
                                    <td>{this.state.classStudents.find( st => this.state.classEvents[idx].id === st._id).surname}</td>
                                    <td>{this.state.classStudents.find( st => this.state.classEvents[idx].id === st._id).name}</td>
                                    <td>{this.state.classStudents.find( st => this.state.classEvents[idx].id === st._id).ssn}</td>
                                    <td>{event.date.split('T')[1].split('+')[0].split('.')[0]}</td>
                                    <td><Button variant="danger" size="sm" onClick={() => this.removeItem(this.state.addedStudents[idx].student._id)}>Remove</Button></td>
                                </tr>);
                            })}
                        </tbody>
                    </Table>
            </div>
        );
    }
}