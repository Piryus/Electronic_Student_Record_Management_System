import '@emarkk/hlib';
import React from 'react';
import {Accordion, Button, Card, Container} from "react-bootstrap";
import SectionHeader from "../../utils/section-header";
import LoadingSpinner from "../../utils/loading-spinner";
import moment from "moment";

export default class Grades extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            childGrades: null,
            isLoading: true
        }
    }

    async componentDidMount() {
        const grades = await this.getChildGrades();
        this.setState({
            childGrades: grades,
            isLoading: false
        });
    }

    async componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.child._id !== this.props.child._id) {
            const grades = await this.getChildGrades();
            this.setState({
                childGrades: grades
            });
        }
    }

    async getChildGrades() {
        // Query child's grades
        const url = 'http://localhost:3000/grades/' + this.props.child._id;
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
        return json.grades;
    }

    render() {
        //Building of Grades and Subejects DOM
        let gradesSortedTopic = [];
        let gradesDOM = [];
        if (this.state.childGrades !== null) {
            this.state.childGrades.forEach((grade) => {
                let realGrade = grade.value.gradify();
                if (gradesSortedTopic[grade.subject] == null) {
                    gradesSortedTopic[grade.subject] = [];
                }
                let date = grade.date.split("T");
                let gradeSubject;
                if (grade.description !== undefined) {
                    gradeSubject = `${grade.description}`;
                } else {
                    gradeSubject = `Grade ${gradesSortedTopic[grade.subject].length + 1}`;
                }
                gradesSortedTopic[grade.subject].push(
                    {
                        htmlElement: <Accordion.Collapse key={grade.subject + grade.date + grade.value} eventKey={grade.subject}>
                            <Card.Body>{gradeSubject} - {moment(date[0]).format('DD/MM/YYYY')} : <b>{grade.value}</b></Card.Body>
                        </Accordion.Collapse>,
                        date: date[0],
                        grade: parseFloat(realGrade)
                    });
            });
            let index;
            let average;
            let sum;
            for (index in gradesSortedTopic) {
                //First compute the average
                average = 0;
                sum = 0;
                for (var i = 0; i < gradesSortedTopic[index].length; i++) {
                    sum += gradesSortedTopic[index][i].grade;
                }
                average = sum / gradesSortedTopic[index].length;

                average = Math.round(average * 100) / 100;

                //Sort by reversed chronological order
                gradesSortedTopic[index].sort(function (a, b) {
                    return new Date(b.date) - new Date(a.date);
                });

                gradesDOM.push(
                    <Card key={index}>
                        <Card.Header>
                            <Accordion.Toggle as={Button} variant="link" eventKey={index}>
                                {index + ' ' + average}
                            </Accordion.Toggle>
                        </Card.Header>
                        {gradesSortedTopic[index].map((grade) => {
                            return grade.htmlElement;
                        })}
                    </Card>
                );
            }
        }

        return (
            <Container fluid>
                <SectionHeader>Grades</SectionHeader>
                {this.state.isLoading && <LoadingSpinner/>}
                {!this.state.isLoading &&
                <Accordion className="mt-3" defaultActiveKey="0">
                    {gradesDOM.map((subject) => {
                        return subject;
                    })}
                </Accordion>}
            </Container>
        );
    }
}