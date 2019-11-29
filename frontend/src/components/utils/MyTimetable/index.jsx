import React, {Component} from 'react';
import './style.sass';
import {Table} from "react-bootstrap";

const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
const hours = ['8:00', '9:00', '10:00', '11:00', '12:00', '13:00'];

class MyTimetable extends Component {
    render() {
        return (
            <Table responsive bordered>
                <thead>
                <tr>
                    <th/>
                    {this.props.data.map((day, index) =>
                        <th>{days[index] + ' ' + day.date.getDate() + '/' + day.date.getMonth()}</th>)}
                </tr>
                </thead>
                <tbody>
                {hours.map((hour, index) => {
                    return (
                        <tr>
                            <td>{hour}</td>
                            {this.props.data.map(day => {
                                return (
                                    <td className={day.content[index].color}>{day.content[index].text}</td>
                                );
                            })}
                        </tr>
                    );
                })}
                </tbody>
            </Table>);
    }
}

export default MyTimetable;