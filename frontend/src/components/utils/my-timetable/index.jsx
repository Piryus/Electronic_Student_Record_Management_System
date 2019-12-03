import React, {Component} from 'react';
import {Table} from "react-bootstrap";

const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
const hours = ['8:00', '9:00', '10:00', '11:00', '12:00', '13:00'];

export default class MyTimetable extends Component {
    render() {
        return (
            <Table responsive bordered>
                <thead>
                <tr>
                    <th/>
                    {this.props.data.map((day, index) =>
                        <th key={index}>{days[index] + ' ' + day.date.getDate() + '/' + (day.date.getMonth() + 1)}</th>)}
                </tr>
                </thead>
                <tbody>
                {hours.map((hour, hourIndex) => {
                    return (
                        <tr key={hourIndex}>
                            <td>{hour}</td>
                            {this.props.data.map((day, dayIndex) => {
                                return (
                                    <td key={dayIndex} className={day.content[hourIndex].color}>{day.content[hourIndex].text}</td>
                                );
                            })}
                        </tr>
                    );
                })}
                </tbody>
            </Table>);
    }
}