import React from 'react';
import {Accordion, Card, Col, Container, Row} from "react-bootstrap";
import SectionHeader from "../../utils/section-header";
import LoadingSpinner from "../../utils/loading-spinner";
import DownloadFileTable from '../../utils/downloadfiletable/downloadfiletable';


export default class Assignments extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            childAssignment: [],
            loading: true
        }
    }

    async componentDidMount() {
        const assignments = await this.getChildAssignment();
        this.setState({
            childAssignment: assignments,
            loading: false
        });
    }

    async componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.child._id !== this.props.child._id) {
            const assignments = await this.getChildAssignment();
            this.setState({
                childAssignment: assignments
            });
        }
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
        return json.assignments;
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
                    <Card.Body>
                        {item.description}
                        {item.attachments.length !== 0 &&(
                            <div>
                                <br></br><i>Attached files:</i>
                                <DownloadFileTable type='assignment' files={item.attachments}/>
                            </div>
                        )}
                    </Card.Body>
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
                return new Date(b.due) - new Date(a.due);
            });
            store.forEach((item) => {
                let tmp;
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
                {this.state.loading && <LoadingSpinner/>}
                {!this.state.loading && output}
            </Container>
        )
    }
}
