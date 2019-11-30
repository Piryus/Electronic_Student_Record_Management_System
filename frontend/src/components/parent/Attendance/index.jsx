import React from 'react';
import MyTimetable from '../../utils/my-timetable';
import SectionHeader from "../../utils/section-header";
import {Container, Spinner} from "react-bootstrap";

export default class Attendance extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            childAttendance: [],
            isLoading: true,
        }
    }

    // Get first monday of the week based on passed date
    startOfWeek = (date) => {
        const diff = date.getDate() - date.getDay() + (date.getDay() === 0 ? -6 : 1);
        return new Date(date.setDate(diff));
    };

    async componentDidMount() {
        await this.getChildAttendance();
    }

    async getChildAttendance() {
        // Query child's attendance
        const url = 'http://localhost:3000/attendance/' + this.props.child._id;
        const options = {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            credentials: 'include',
        };
        const response = await fetch(url, options);
        const json = await response.json();
        if (this.state.childAttendance !== json.attendance) {
            this.setState({
                childAttendance: json.attendance,
                isLoading: false
            });
        }
    }

    render() {
        // Basic data construction
        let data = [];
        for (let dayIndex = 0; dayIndex < 5; dayIndex++) {
            let dateObject = {};
            dateObject.date = new Date(this.startOfWeek(new Date())); // TODO Use hlib
            dateObject.date.setDate(dateObject.date.getDate() + dayIndex);
            let content = [];
            for (let hourIndex = 0; hourIndex < 6; hourIndex++) {
                content.push({
                    text: '',
                    color: 'bg-success text-white'
                });
            }
            dateObject.content = content;
            data.push(dateObject);
        }

        // Loop through the events to add them to the DOM
        this.state.childAttendance.forEach(event => {
            // Retrieves the event Date object from the date string
            const eventDate = new Date(event.date);
            // Create a Date object for the beginning of the courses on the date of the event
            const lectureBeginDate = new Date(eventDate);
            lectureBeginDate.setHours(8);
            // Loop through the current DOM data, checking if the event date matches a date to be displayed
            data.forEach(day => {
                if (eventDate.getDate() === day.date.getDate() &&
                    eventDate.getMonth() === day.date.getMonth() &&
                    eventDate.getFullYear() === day.date.getFullYear()) {
                    // Found a match!
                    if (event.event === 'absence') { // 'Absence' event management
                        // Each hour of the day will be marked 'absent'
                        day.content.forEach((hour => {
                            hour.color = 'bg-danger text-white';
                            hour.text = 'Absent';
                        }))
                    } else if (event.event === 'late-entry') { // 'Late entry' event management
                        // Computes the difference in hours between day beginning and event
                        const diff = Math.abs(eventDate - lectureBeginDate) / (60 * 60 * 1000);
                        // Colors and marks the correspondent hour of the day
                        day.content[diff].color = 'bg-warning text-dark';
                        day.content[diff].text = 'Arrived late';
                    } else if (event.event === 'early-exit') { // 'Early exit' event management
                        // Computes the difference in hours between day beginning and event
                        const diff = Math.abs(eventDate - lectureBeginDate) / (60 * 60 * 1000);
                        // Colors and marks the correspondent hour of the day
                        day.content[diff].color = 'bg-warning text-dark';
                        day.content[diff].text = 'Left early';
                        // Colors and marks each following hour of the day with 'Absent'
                        for (let i = diff + 1; i < day.content.length; i++) {
                            day.content[i].color = 'bg-danger text-white';
                            day.content[i].text = 'Absent';
                        }
                    }
                }
            });
        });

        return (
            <Container fluid>
                <SectionHeader>Attendance</SectionHeader>
                {this.state.isLoading &&
                <div className="d-flex">
                    <Spinner animation="border" className="mx-auto"/>
                </div>}
                {!this.state.isLoading && <MyTimetable data={data}/>}
            </Container>
        );
    }
}