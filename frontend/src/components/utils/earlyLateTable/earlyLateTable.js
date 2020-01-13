import React from 'react';
import {Button, Table} from 'react-bootstrap';


export default class EarlyLateTable extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            classStudents: this.props.classStudents,
            classEvents: [],
            removedItems: [],
            workingHours: this.props.whs
        }
    }

    async componentDidMount() {
        await this.getEvents();
    }

    async getEvents() {
        try {
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

            let attendance = json.attendance[this.props.classId];


            this.setState({classEvents: attendance});
        } catch (e) {
            alert(e);
        }
    }

    async removeItem(studentEvents) {
        let eventsVector = [
            {
                studentId: studentEvents.id,
                time: null,
                attendanceEvent: this.props.type
            }
        ];
        let infoToSend = {
            classId: this.props.classId,
            info: eventsVector
        }
        await this.pushDataToDb(infoToSend);
        await this.getEvents();
    }

    async pushDataToDb(infoToSend) {
        try {
            const url = 'http://localhost:3000/attendance';
            const jsonToSend = JSON.stringify(infoToSend);
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
                alert('Ops! Internal error. Please retry!');
                window.location.reload(false);
            } else {
                alert('Event successfully removed.');
            }
        } catch (err) {
            alert(err);
            window.location.reload(false);
        }
    }


    render() {
        return (
            <div>
                <Button variant="outline-primary" onClick={() => this.props.dontWantSeeEvents()}>←
                    Back</Button><br></br><br></br>
                <i>In this table you can see already recorded events.</i>
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
                            let hour = new Date(e.date).longString().split(' ');
                            hour = hour[1].split(':');
                            hour = parseInt(hour[0]) - 8;
                            return e.event === this.props.type && this.state.workingHours.includes(hour);
                        });

                        return event === undefined ? null : (<tr key={idx}>
                            <td>{this.state.classStudents.find(st => this.state.classEvents[idx].id === st._id).surname}</td>
                            <td>{this.state.classStudents.find(st => this.state.classEvents[idx].id === st._id).name}</td>
                            <td>{this.state.classStudents.find(st => this.state.classEvents[idx].id === st._id).ssn}</td>
                            <td>{new Date(event.date).longString().split(' ')[1]}</td>
                            <td><Button variant="danger" size="sm"
                                        onClick={() => this.removeItem(this.state.classEvents[idx])}>Remove</Button>
                            </td>
                        </tr>);
                    })}
                    </tbody>
                </Table>
            </div>
        );
    }
}