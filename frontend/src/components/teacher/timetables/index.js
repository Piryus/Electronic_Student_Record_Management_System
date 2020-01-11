import React from "react";
import {Container, Dropdown, DropdownButton} from "react-bootstrap";
import SectionHeader from "../../utils/section-header";
import Timetable from "../../utils/timetable";
import LoadingSpinner from "../../utils/loading-spinner";

export default class ClassesTimetables extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedClass: {},
            isLoading: true,
            timetable: [],
            classes: []
        }
    }

    async componentDidMount() {
        const {classes, teacherTimetable} = this.props;
        let teacherClasses = classes.filter(c => teacherTimetable.find(t => t.classId === c._id) !== undefined);
        let timetable = [];
        let selectedClass = {};
        if (teacherClasses.length > 0) {
            timetable = await this.fetchTimetable(teacherClasses[0]._id);
            selectedClass = teacherClasses[0];
        }
        this.setState({
            timetable,
            isLoading: false,
            classes: teacherClasses,
            selectedClass
        });
    }

    async selectClass(class_) {
        const timetable = await this.fetchTimetable(class_._id);
        this.setState({
            selectedClass: class_,
            timetable
        });
    }

    async fetchTimetable(classId) {
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
                <SectionHeader>Classes timetables</SectionHeader>
                {this.state.isLoading && <LoadingSpinner/>}
                {!this.state.isLoading &&
                <>
                    <DropdownButton className='mb-2'
                                    title={this.state.selectedClass !== {} ? this.state.selectedClass.name : 'Select a class'}>
                        {this.state.classes.map(class_ =>
                            <Dropdown.Item
                                key={class_._id}
                                onClick={async () => await this.selectClass(class_)}>{class_.name}</Dropdown.Item>
                        )}
                    </DropdownButton>
                    {this.state.timetable !== [] &&
                    <Timetable data={timetableData} frequency={60} hideDate/>}
                </>
                }
            </Container>
        );
    }
}