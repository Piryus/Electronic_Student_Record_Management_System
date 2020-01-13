import React, {Component} from 'react';
import {Table} from "react-bootstrap";
import moment from 'moment';
import fetchCalendar from "../calendar";

const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];


export default class Timetable extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedWeekHour: '',
            selectedDate: '',
            calendar: null
        };
    }

    async componentDidMount() {
        const calendar = await fetchCalendar();
        this.setState({calendar});
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
        const {data} = this.props;
        if (this.state.calendar !== null && !this.props.hideDate) {
            data.forEach((day, index) => {
                if (!day.date.isSchoolDay(this.state.calendar)) {
                    data[index].content.forEach(hour => {
                        hour.text = 'Holiday';
                        hour.color = 'bg-info text-white'
                    });
                }
            });
        }

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
                    {data.map((day, index) => {
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
                            <td style={{width: '10%'}}>{hour}</td>
                            {data.map((day, dayIndex) => {
                                return (
                                    <td key={dayIndex}
                                        style={{width: '18%'}}
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

async function fetchStudentTimetableData(childId) {
    const url = `http://localhost:3000/timetable/student/${childId}`;
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
    const timetable = json.timetable;

    // Basic data construction
    let timetableData = getBasicTimetableData();

    if (timetable !== null) {
        timetableData = buildClassTimetableData(timetable, timetableData);
    }

    return timetableData;
}

async function fetchClassTimetableData(classId) {
    const url = `http://localhost:3000/timetable/${classId}`;
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
    const timetable = json.timetable;

    // Basic data construction
    let timetableData = getBasicTimetableData();

    if (timetable !== null) {
        timetableData = buildClassTimetableData(timetable, timetableData);
    }

    return timetableData;
}

function getBasicTimetableData() {
    let timetableData = [];
    for (let dayIndex = 0; dayIndex < 5; dayIndex++) {
        let dateObject = {};
        dateObject.date = new Date().weekStart();
        dateObject.date.setDate(dateObject.date.getDate() + dayIndex);
        let content = [];
        for (let hourIndex = 0; hourIndex < 6; hourIndex++) {
            content.push({
                text: '',
                color: 'bg-secondary'
            });
        }
        dateObject.content = content;
        timetableData.push(dateObject);
    }
    return timetableData;
}

function buildClassTimetableData(timetable, timetableData) {
    let newTimetableData = timetableData;
    timetable.forEach(class_ => {
        const [day, hour] = class_.weekhour.split('_');
        newTimetableData[day].content[hour].text = class_.subject + ' (' + class_.teacher.surname + ' ' + class_.teacher.name + ')';
        newTimetableData[day].content[hour].color = 'bg-success text-white';
    });
    return newTimetableData;
}

export {
    Timetable,
    fetchStudentTimetableData,
    fetchClassTimetableData
};