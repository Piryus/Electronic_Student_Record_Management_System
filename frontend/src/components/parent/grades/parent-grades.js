import React from 'react';
import {Accordion, Button, Card, Container} from "react-bootstrap";

export default class Grades extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            childGrades: null,
        }
    }

    async componentDidMount() {
        await this.getChildGrades();
    }

    async componentWillUpdate() {
        await this.getChildGrades();
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
        this.setState({
            childGrades: json.grades
        });
    }

    render() {
        //Building of Grades and Subejects DOM
        let gradesSortedTopic = [];
        let gradesDOM = [];
        if (this.state.childGrades !== null) {
            this.state.childGrades.map((grade) => {
                if (gradesSortedTopic[grade.subject] == null) {
                    gradesSortedTopic[grade.subject] = [];
                }
                let date = grade.date.split("T");
                gradesSortedTopic[grade.subject].push(
                    <Accordion.Collapse eventKey={grade.subject}>
                        <Card.Body>Grade {gradesSortedTopic[grade.subject].length + 1}: {grade.value} Date
                            : {date[0]}</Card.Body>
                    </Accordion.Collapse>
                );
            });
            let index;
            for (index in gradesSortedTopic) {
                gradesDOM.push(
                    <Card>
                        <Card.Header>
                            <Accordion.Toggle as={Button} variant="link" eventKey={index}>
                                {index}
                            </Accordion.Toggle>
                        </Card.Header>
                        {gradesSortedTopic[index].map((grade) => {
                            return grade;
                        })}
                    </Card>
                );
            }
        }

        return (
            <Container fluid className="mt-2">
                <h2>Grades</h2>
                <Accordion className="mt-3" defaultActiveKey="0">
                    {gradesDOM.map((subject) => {
                        return subject;
                    })}
                </Accordion>
            </Container>
        );
    };
}