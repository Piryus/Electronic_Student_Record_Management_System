import React, {Component} from 'react';
import {Table} from "react-bootstrap";
import moment from 'moment';

const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];


export default class Timetable extends Component {
    constructor(props) {
        super(props);

        this.state = {
            selectedWeekHour: ''
        };
    }

    selectCell = (dayIndex, hourIndex) => {
        if (this.props.selectable) {
            const weekHour = dayIndex + '_' + hourIndex;
            this.setState({
                selectedWeekHour: weekHour
            });
            this.props.selectionHandler(weekHour);
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