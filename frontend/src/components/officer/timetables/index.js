import React from "react";
import {Alert, Container, Dropdown, DropdownButton} from "react-bootstrap";
import SectionHeader from "../../utils/section-header";
import Timetable from "../../utils/timetable";

export default class TimetablesManager extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            classes: [],
            selectedClass: null,
            error: ''
        };
    }

    async componentDidMount() {
        const classes = await this.getClasses();
        this.setState({
            classes,
            error: ''
        });
    }

    async getClasses() {
        const url = 'http://localhost:3000/classes';
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
        return json.classes;
    };

    async uploadTimetable(file) {
        const url = 'http://localhost:3000/timetables';
        const formData = new FormData();
        formData.append('timetablesFile', file);
        const options = {
            method: 'POST',
            credentials: 'include',
            body: formData
        };
        const response = await fetch(url, options);
        const json = await response.json();
        if (json.success) {
            const classes = await this.getClasses();
            this.setState({
                classes
            })
        } else {
            this.setState({
                error: 'The timetable couldn\'t be uploaded to the school servers...'
            })
        }
    };

    async selectClass(class_) {
        this.setState({
            selectedClass: class_
        })
    }

    // Get first monday of the week based on passed date
    startOfWeek = (date) => {
        const diff = date.getDate() - date.getDay() + (date.getDay() === 0 ? -6 : 1);
        return new Date(date.setDate(diff));
    };

    render() {
        // Basic data construction
        let timetableData = [];
        for (let dayIndex = 0; dayIndex < 5; dayIndex++) {
            let dateObject = {};
            dateObject.date = new Date(this.startOfWeek(new Date())); // TODO Use hlib
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

        if (this.state.selectedClass !== null) {
            this.state.selectedClass.timetable.forEach(class_ => {
                const [day, hour] = class_.weekhour.split('_');
                timetableData[day].content[hour].text = class_.subject + ' (' + class_.teacher.surname + ' ' + class_.teacher.name + ')';
                timetableData[day].content[hour].color = 'bg-success text-white';
            });
        }

        return (
            <Container fluid>
                <SectionHeader>Manage timetables</SectionHeader>
                {this.state.error !== '' && <Alert variant="danger">{this.state.error}</Alert>}
                <DropdownButton className='mb-2'
                                title={this.state.selectedClass ? this.state.selectedClass.name : 'Select a class'}>
                    {this.state.classes.map(class_ =>
                        <Dropdown.Item
                            key={class_._id}
                            onClick={async () => await this.selectClass(class_)}>{class_.name}</Dropdown.Item>
                    )}
                </DropdownButton>
                {this.state.selectedClass !== null && this.state.selectedClass.timetable.length === 0 &&
                <h6>{this.state.selectedClass.name} doesn't have a timetable yet!</h6>}
                {this.state.selectedClass !== null &&
                <div className="custom-file mb-2 col-12 col-sm-6 col-md-6 col-lg-4 col-xl-4">
                    <input type="file" className="custom-file-input" id="customFile"
                           onChange={(e) => this.uploadTimetable(e.target.files[0])}
                           accept=".csv"/>
                    <label className="custom-file-label" htmlFor="customFile">Import a timetable...</label>
                </div>}
                {this.state.selectedClass !== null && this.state.selectedClass.timetable.length > 0 &&
                <Timetable data={timetableData} frequency={60} hideDate/>}
            </Container>
        );
    }
}