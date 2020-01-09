import React, {Component} from 'react';
import {Table} from "react-bootstrap";
import moment from 'moment';

const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];


export default class Timetable extends Component {
    constructor(props) {
        super(props);

        this.state = {
            selectedWeekHour: '',
            selectedDate: ''
        };
    }

    selectCell = (dayIndex, hourIndex) => {
        const weekHour = dayIndex + '_' + hourIndex;
        const date = this.props.data[dayIndex];
        if (this.props.selectionHandler) {
            this.props.selectionHandler(weekHour, date);
        }
        if (this.props.selectable) {
            this.setState({
                selectedWeekHour: weekHour,
                selectedDate: date
            });
        }
    };

    render() {
        const hours = [];
        let time = moment('8:00', 'HH:mm');
        let endOfDay = moment('14:00', 'HH:mm');
        while (time.isBefore(endOfDay)) {
            hours.push(time.format('HH:mm'));
            time.add(this.props.frequency, 'm');
        }

        return (
            <Table responsive bordered size={this.props.small ? 'sm' : ''}>
                <thead>
                <tr>
                    <th/>
                    {this.props.data.map((day, index) => {
                        let dayString;
                        if (this.props.hideDate) {
                            dayString = days[index];
                        } else {
                            dayString = days[index] + ' ' + day.date.getDate() + '/' + (day.date.getMonth() + 1);
                        }
                        return <th key={index}>{dayString}</th>
                    })}
                </tr>
                </thead>
                <tbody>
                {hours.map((hour, hourIndex) => {
                    return (
                        <tr key={hourIndex}>
                            <td>{hour}</td>
                            {this.props.data.map((day, dayIndex) => {
                                return (
                                    <td key={dayIndex}
                                        className={this.state.selectedWeekHour === dayIndex + '_' + hourIndex ? 'bg-warning' : day.content[hourIndex].color}
                                        onClick={() => this.selectCell(dayIndex, hourIndex)}>
                                        {day.content[hourIndex].text}
                                    </td>
                                );
                            })}
                        </tr>
                    );
                })}
                </tbody>
            </Table>);
    }
}