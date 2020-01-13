import React from "react";
import {Container} from "react-bootstrap";
import SectionHeader from "../../utils/section-header";
import LoadingSpinner from "../../utils/loading-spinner";
import Timetable from "../../utils/timetable";

export default class ChildTimetable extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            timetable: null,
            isLoading: true
        }
    }

    async componentDidMount() {
        const timetable = await this.fetchTimetable(this.props.child._id);
        this.setState({
            timetable,
            isLoading: false
        });
    }

    async componentDidUpdate(prevProps, prevState, prevContext) {
        if (prevProps.child !== this.props.child) {
            const timetable = await this.fetchTimetable(this.props.child._id);
            this.setState({
                timetable
            });
        }
    }

    async fetchTimetable(childId) {
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
        return json.timetable;
    }

    render() {
        // Basic data construction
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

        if (this.state.timetable !== null) {
            this.state.timetable.forEach(class_ => {
                const [day, hour] = class_.weekhour.split('_');
                timetableData[day].content[hour].text = class_.subject + ' (' + class_.teacher.surname + ' ' + class_.teacher.name + ')';
                timetableData[day].content[hour].color = 'bg-success text-white';
            });
        }

        return (
            <Container fluid>
                <SectionHeader>Timetable</SectionHeader>
                {this.state.isLoading && <LoadingSpinner/>}
                {!this.state.isLoading &&
                <Timetable data={timetableData} frequency={60} hideDate/>
                }
            </Container>
        );
    }
}