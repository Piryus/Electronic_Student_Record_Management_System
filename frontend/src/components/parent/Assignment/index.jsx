import React, {Component} from 'react';
import {Accordion, Card, Col, Container, Row} from "react-bootstrap";
import SectionHeader from "../../utils/section-header";

class Assignment extends Component {


    constructor(props) {
        super(props);
        this.state = {
            childAssignment: [],
        }
    }

    async componentDidMount() {
        await this.getChildAssignment();
    }

    async componentDidUpdate() {
        await this.getChildAssignment();
    }

    async getChildAssignment() {
        // Query child's assignments
        const url = 'http://localhost:3000/assignments/' + this.props.child._id;
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
        if (this.state.childAssignment !== json.assignments) {
            this.setState({
                childAssignment: json.assignments
            });
        }
    }

    renderItem = (item, index) => {
        return (
            <Card>
                <Accordion.Toggle as={Card.Header} eventKey={index.toString()}>
                    <Row>
                        <Col>{item.subject}</Col>
                        <Col>{item.assigned}</Col>
                        <Col className="text-danger">{item.due}</Col>
                    </Row>
                </Accordion.Toggle>
                <Accordion.Collapse eventKey={index.toString()}>
                    <Card.Body>{item.description}</Card.Body>
                </Accordion.Collapse>
            </Card>
        );
    };


    render() {
        // Handles data from backend, especially date. Likely sort by date
        let output;
        let store = this.state.childAssignment;
        if (Array.isArray(store) && store.length) {
            store.sort(function (a, b) {
                return new Date(a) - new Date(b);
            });
            store.map((item) => {
                let tmp = [];
                tmp = item.due.split("T");
                item.due = tmp[0];
                tmp = item.assigned.split("T");
                item.assigned = tmp[0];
            });
            output = (
                <Accordion>
                    <Card>
                        <Accordion.Toggle as={Card.Header}>
                            <Row>
                                <Col className="font-weight-bold">Subject</Col>
                                <Col className="font-weight-bold">Published</Col>
                                <Col className="font-weight-bold">Deadline</Col>
                            </Row>
                        </Accordion.Toggle>
                    </Card>
                    {store.map(this.renderItem)}
                </Accordion>
            )
        } else {/*
      output= <h3 style= {{color: "red"}}>You currently have no pending assignments!!!!</h3>
    */
        }


        return (
            <Container fluid>
                <SectionHeader>Assignments</SectionHeader>
                {output}
            </Container>
        )
    }
}

export default Assignment;
