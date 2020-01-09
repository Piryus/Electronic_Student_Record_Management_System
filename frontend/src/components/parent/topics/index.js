import React from 'react';
import SectionHeader from '../../utils/section-header';
import { Container, Form, Button } from 'react-bootstrap';
import Timetable from "../../utils/timetable";
import LoadingSpinner from "../../utils/loading-spinner";



export default class ParentLectureTopics extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            timetable: [],
            isLoading: true,
            selectedWeekHour: '',
            topicString: '',
            focusDay: new Date(Date.now())
        };
    }

    handleWeek(week) {
        let focusDay = this.state.focusDay;
        switch (week) {
            case 0:
                this.setState({focusDay: new Date(Date.now()), topicString: ''});
                break;
            case 1:
                focusDay.setDate(focusDay.getDate() + 7);
                this.setState({focusDay: focusDay, topicString: ''});
                break;
            case -1:
                focusDay.setDate(focusDay.getDate() - 7);
                this.setState({focusDay: focusDay, topicString: ''});
                break;
        }
    }

    // Get first monday of the week based on passed date
    startOfWeek = (date) => {
        const diff = date.getDate() - date.getDay() + (date.getDay() === 0 ? -6 : 1);
        return new Date(date.setDate(diff));
    };

    async componentDidMount(){
        await this.getChildTimetable();
    }

    async componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.child._id !== this.props.child._id) {
            await this.getChildTimetable();
        }
    }

    async getLectureTopics(){
        const url = 'http://localhost:3000/timetable/' + this.props.child._id;
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

        this.setState({timetable: json.timetable});

    }

    async getChildTimetable(){
        const url = 'http://localhost:3000/timetable/student/' + this.props.child._id;
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
        this.setState({timetable: json.timetable, isLoading: false});

    }

    async handleSelection(weekHour, date) {
        var w_h = weekHour.split('_');
        var month = date.date.getMonth() + 1; //months from 1-12
        var day = date.date.getDate();
        var year = date.date.getFullYear();

        var newdate = year + "-" + month + "-" + day;
        var dat = new Date(newdate);
        dat.setHours(dat.getHours() + 7 + parseInt(w_h[1]));
        await this.getTopics(weekHour, dat.getTime());
    }

    async getTopics(weekhour, dateInSeconds){
        const url = 'http://localhost:3000/lectures/student/' + this.props.child._id + '?datetime=' + dateInSeconds;
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
        if(json.topics === null || json.topics === undefined){
            this.setState({topicString: ''});
        } else {
            this.setState({topicString: json.topics});
        }
    }

    render(){

        let data = [];
        for (let dayIndex = 0; dayIndex < 5; dayIndex++) {
            let dateObject = {};
            dateObject.date = new Date(this.startOfWeek(this.state.focusDay)); // TODO Use hlib
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

        this.state.timetable.forEach(element => {
            const [day, hour] = element.weekhour.split('_');
            data[day].content[hour].text = element.subject;
            data[day].content[hour].color = 'bg-success text-white';
        });

        return(
            <Container fluid>
                <SectionHeader> Lecture Topics </SectionHeader>
                {this.state.isLoading && <LoadingSpinner/>}
                {!this.state.isLoading &&
                <>
                    <div className='mb-2 d-flex justify-content-between'>
                        <Button onClick={() => this.handleWeek(-1)}>Previous week</Button>
                        <Button onClick={() => this.handleWeek(0)}>Current week</Button>
                        <Button onClick={() => this.handleWeek(1)}>Next week</Button>
                    </div>
                    <Timetable data={data} selectable selectionHandler={(weekhour, date) => this.handleSelection(weekhour, date)} frequency={60}/>
                    <h6>Topics covered:</h6>
                    <Form.Control as="textarea"
                              rows="5"
                              disabled={this.state.selectedWeekHour === ''}
                              value={this.state.topicString}/>
                </>
                }
            </Container>
        );
    }
}