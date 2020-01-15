import React, {Component} from 'react';
import SectionHeader from "../../utils/section-header";
import {Button, Container, Form} from "react-bootstrap";
import Timetable from "../../utils/timetable";
import Toast from "react-bootstrap/Toast";

class LectureTopics extends Component {

    constructor(props) {
        super(props);
        this.state = {
            selectedWeekHour: '',
            topicString: '',
            showToast: false
        };
    }

    async getTopic(weekHour) {
        const url = 'http://localhost:3000/lectures/' + weekHour;
        const options = {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            credentials: 'include'
        };
        const rawResponse = await fetch(url, options);
        const response = await rawResponse.json();
        return response.topics || '';
    }

    async updateTopic() {
        const url = 'http://localhost:3000/lectures';
        const options = {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({
                weekhour: this.state.selectedWeekHour,
                topics: this.state.topicString
            })
        };
        const response = await fetch(url, options);
        const responseJson = await response.json();
        if (responseJson.success) {
            this.setState({showToast: true});
        }
    }

    // Get first monday of the week based on passed date
    startOfWeek = (date) => {
        const diff = date.getDate() - date.getDay() + (date.getDay() === 0 ? -6 : 1);
        return new Date(date.setDate(diff));
    };

    async handleSelection(weekHour) {
        if (this.props.timetable.find(class_ => class_.weekhour === weekHour) !== undefined) {
            const topic = await this.getTopic(weekHour);
            this.setState({
                selectedWeekHour: weekHour,
                topicString: topic
            });
        } else {
            this.setState({
                selectedWeekHour: '',
                topicString: ''
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

        this.props.timetable.forEach(class_ => {
            let foundClassName = '';
            if (this.props.classes.length > 0)
                foundClassName = this.props.classes.find(c => {
                    return c._id === class_.classId
                }).name;
            const [day, hour] = class_.weekhour.split('_');
            data[day].content[hour].text = class_.subject + ' (' + foundClassName + ')';
            data[day].content[hour].color = 'bg-success text-white';
        });

        return (
            <Container fluid>
                <SectionHeader>Lectures</SectionHeader>

                <div className="position-absolute">
                    <Toast className="ml-auto"
                           onClose={() => this.setState({showToast: false})}
                           show={this.state.showToast}
                           delay={3000}
                           autohide>
                        <Toast.Header>
                            <strong className="mr-auto">Administration</strong>
                            <small>right now</small>
                        </Toast.Header>
                        <Toast.Body>The topic has been successfully updated!</Toast.Body>
                    </Toast>
                </div>

                <Timetable data={data} selectable selectionHandler={(weekhour) => this.handleSelection(weekhour)} frequency={60}/>
                <h6>Topics covered:</h6>
                <Form.Control as="textarea"
                              rows="5"
                              onChange={(e) => this.setState({topicString: e.target.value})}
                              disabled={this.state.selectedWeekHour === ''}
                              value={this.state.topicString}/>
                <Button className="mt-1" onClick={() => this.updateTopic()}
                        disabled={this.state.selectedWeekHour === ''}
                        type="submit">Save changes</Button>
            </Container>
        )
    }
}

export default LectureTopics;