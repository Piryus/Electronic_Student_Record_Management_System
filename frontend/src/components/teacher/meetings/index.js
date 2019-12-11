import React from "react";
import {Container} from "react-bootstrap";
import SectionHeader from "../../utils/section-header";
import Timetable from "../../utils/timetable";

export default class Meetings extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedWeekHours: []
        }
    }

    // Get first monday of the week based on passed date
    startOfWeek = (date) => {
        const diff = date.getDate() - date.getDay() + (date.getDay() === 0 ? -6 : 1);
        return new Date(date.setDate(diff));
    };

    toggleWeekHour(weekHour) {
        const classAtWeekHour = this.props.teacherTimetable.find(class_ => {
            if (class_.weekhour === weekHour)
                return true
        });
        if (classAtWeekHour === undefined) {
            let selectedWeekHours = this.state.selectedWeekHours;
            if (this.state.selectedWeekHours.includes(weekHour)) {
                selectedWeekHours = selectedWeekHours.filter(weekHourItem => weekHourItem !== weekHour);
            } else {
                selectedWeekHours.push(weekHour);
            }
            this.setState({
                selectedWeekHours
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
                    color: 'bg-light'
                });
            }
            dateObject.content = content;
            data.push(dateObject);
        }

        this.props.teacherTimetable.forEach(class_ => {
            const [day, hour] = class_.weekhour.split('_');
            data[day].content[hour].text = class_.subject;
            data[day].content[hour].color = 'bg-danger text-white';
        });

        this.state.selectedWeekHours.forEach(weekHour => {
            const [dayIndex, hourIndex] = weekHour.split('_');
            console.log(dayIndex + ' ' + hourIndex);
            data[dayIndex].content[hourIndex].color = 'bg-success';
        });

        return (
            <Container fluid>
                <SectionHeader>Meetings with parents</SectionHeader>
                <h6>Select the time slots you are available to meet parents</h6>
                <Timetable data={data} selectionHandler={(weekHour) => this.toggleWeekHour(weekHour)} frequency={60} />
            </Container>
        );
    }
}