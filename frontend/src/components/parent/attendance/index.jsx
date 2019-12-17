import React from 'react';
import Timetable from '../../utils/timetable';
import SectionHeader from "../../utils/section-header";
import {Button, Container} from "react-bootstrap";
import LoadingSpinner from "../../utils/loading-spinner";

export default class Attendance extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            childAttendance: [],
            isLoading: true,
            focusDay: new Date(Date.now())
        }
    }

    handleWeek(week) {
        let focusDay = this.state.focusDay;
        switch (week) {
            case 0:
                this.setState({focusDay: new Date(Date.now())});
                break;
            case 1:
                focusDay.setDate(focusDay.getDate() + 7);
                this.setState({focusDay});
                break;
            case -1:
                focusDay.setDate(focusDay.getDate() - 7);
                this.setState({focusDay});
                break;
        }
    }

    // Get first monday of the week based on passed date
    startOfWeek = (date) => {
        const diff = date.getDate() - date.getDay() + (date.getDay() === 0 ? -6 : 1);
        return new Date(date.setDate(diff));
    };

    async componentDidMount() {
        const attendance = await this.getChildAttendance();
        this.setState({
            childAttendance: attendance,
            isLoading: false
        });
    }

    async componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.child._id !== this.props.child._id) {
            const attendance = await this.getChildAttendance();
            this.setState({
                childAttendance: attendance
            });
        }
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
        return json.attendance;
    }

    render() {
        // Basic data construction
        let data = [];
        for (let dayIndex = 0; dayIndex < 5; dayIndex++) {
            let dateObject = {};
            dateObject.date = new Date(this.startOfWeek(this.state.focusDay)); // TODO Use hlib
            dateObject.date.setDate(dateObject.date.getDate() + dayIndex);
            let content = [];
            for (let hourIndex = 0; hourIndex < 6; hourIndex++) {
                if (dateObject.date < Date.now()) {
                    content.push({
                        text: '',
                        color: 'bg-success text-white'
                    });
                } else {
                    content.push({
                        text: '',
                        color: 'bg-secondary'
                    });
                }
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
                    } else if (event.event === 'late-entrance') { // 'Late entrance' event management
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
                {this.state.isLoading && <LoadingSpinner/>}
                {!this.state.isLoading &&
                <>
                    <div className='mb-2 d-flex justify-content-between'>
                        <Button onClick={() => this.handleWeek(-1)}>Previous week</Button>
                        <Button onClick={() => this.handleWeek(0)}>Current week</Button>
                        <Button onClick={() => this.handleWeek(1)}>Next week</Button>
                    </div>
                    < Timetable data={data} frequency={60} />
                </>
                }
            </Container>
        );
    }
}