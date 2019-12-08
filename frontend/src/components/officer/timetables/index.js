import React from "react";
import {Button, Container, Dropdown, DropdownButton, Form} from "react-bootstrap";
import SectionHeader from "../../utils/section-header";
import Timetable from "../../utils/timetable";

export default class TimetablesManager extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            classes: [],
            selectedClass: null,
            classTimetable: null,
        };
    }

    async componentDidMount() {
        const classes = await this.getClasses();
        this.setState({
            classes
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

    async getClassTimetable() {
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
        return null;
    };

    async selectClass(class_) {
        const timetable = await this.getClassTimetable();
        this.setState({
            selectedClass: class_,
            classTimetable: timetable
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
            timetableData.push(dateObject);
        }

        return (
            <Container fluid>
                <SectionHeader>Manage timetables</SectionHeader>
                <DropdownButton className='mb-2'
                                title={this.state.selectedClass && this.state.selectedClass.name || 'Select a class'}>
                    {this.state.classes.map(class_ =>
                        <Dropdown.Item
                            onClick={async () => await this.selectClass(class_)}>{class_.name}</Dropdown.Item>
                    )}
                </DropdownButton>
                {this.state.classTimetable !== null &&
                <Timetable data={timetableData}/>}
                {this.state.selectedClass !== null && this.state.classTimetable === null &&
                    <>
                        <h6>{this.state.selectedClass.name} doesn't have a timetable yet!</h6>
                        <div className="custom-file col-12 col-sm-6 col-md-6 col-lg-4 col-xl-4">
                            <input type="file" className="custom-file-input" id="customFile" onChange={() => console.log('File selected')}/>
                                <label className="custom-file-label" htmlFor="customFile">Import a timetable...</label>
                        </div>
                    </>
                }
            </Container>
        );
    }
}