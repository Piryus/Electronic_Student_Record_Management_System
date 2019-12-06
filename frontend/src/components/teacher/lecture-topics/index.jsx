import React, {Component} from 'react';
import './style.sass';
import SectionHeader from "../../utils/section-header";
import {Button, Container, Form} from "react-bootstrap";
import MyTimetable from "../../utils/my-timetable";

class LectureTopics extends Component {

    state = {
        busy: false,
        selectedWeekhour: null,
        topicsString: '',
        newTopicsString: ''
    };

    async hourSelected(wh) {
        if (!this.state.busy) {
            this.setState({
                busy: true,
                selectedWeekhour: wh
            });
            const url = 'http://localhost:3000/lectures/' + wh;
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
            this.setState({
                busy: false,
                topicsString: response.topics || '',
                newTopicsString: response.topics || ''
            });
        }
    }

    async saveChanges() {
        if (!this.state.busy) {
            this.setState({
                busy: true
            });
            const url = 'http://localhost:3000/lectures';
            const options = {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({
                    weekhour: this.state.selectedWeekhour,
                    topics: this.state.newTopicsString
                })
            };
            const rawResponse = await fetch(url, options);
            const response = await rawResponse.json();
            this.setState({
                busy: false,
                topicsString: this.state.newTopicsString
            });
        }
    }

    // Get first monday of the week based on passed date
    startOfWeek = (date) => {
        const diff = date.getDate() - date.getDay() + (date.getDay() === 0 ? -6 : 1);
        return new Date(date.setDate(diff));
    };

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
            const [day, hour] = class_.weekhour.split('_');
            data[day].content[hour].text = class_.subject;
            data[day].content[hour].color = 'bg-success text-white';
        });

        return (
            <Container fluid>
                <SectionHeader>Lectures</SectionHeader>
                <MyTimetable data={data} selectable />
                {/*<Timetable selectable data={this.props.timetable} selected={this.state.selectedWeekhour}*/}
                {/*           onClick={(wh) => this.hourSelected(wh)}/>*/}
                <span className="topics-label">Topics</span>
                <Form.Control as="textarea" rows="5" onChange={(e) => this.setState({newTopicsString: e.target.value})}
                              disabled={this.state.selectedWeekhour === null} value={this.state.newTopicsString || ''}/>
                <Button className="submit-button" onClick={() => this.saveChanges()}
                        disabled={this.state.selectedWeekhour === null || (this.state.topicsString === this.state.newTopicsString)}
                        type="submit">Save changes</Button>
            </Container>
        )
    }
}

export default LectureTopics;