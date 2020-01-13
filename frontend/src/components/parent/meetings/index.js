import React from 'react';
import {Button, Container, Table} from 'react-bootstrap';
import SectionHeader from "../../utils/section-header";
import LoadingSpinner from "../../utils/loading-spinner";
import NewAppointmentModal from "./new-appointment-modal";
import moment from "moment";

export default class Meetings extends React.Component {
    constructor(props) {
        super(props);
        moment.locale('en-US');
        this.state = {
            showNewAppointmentModal: false,
            meetings: [],
            isLoading: true
        }
    }

    async componentDidMount() {
        const meetings = await this.fetchBookedMeetings();
        this.setState({
            meetings,
            isLoading: false
        });
    }

    async fetchBookedMeetings() {
        const url = 'http://localhost:3000/meetings';
        const options = {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            credentials: 'include'
        };
        const response = await fetch(url, options);
        const json = await response.json();
        return json.meetings;
    }

    render() {
        return (
            <Container fluid>
                <SectionHeader>Meetings with teachers</SectionHeader>
                {this.state.isLoading && <LoadingSpinner/>}
                {!this.state.isLoading &&
                <>
                    <NewAppointmentModal show={this.state.showNewAppointmentModal}
                                         onClose={async () => {
                                             this.setState({
                                                 showNewAppointmentModal: false,
                                                 meetings: await this.fetchBookedMeetings()
                                             })
                                         }}/>
                    <Button
                        onClick={() => this.setState({showNewAppointmentModal: true})}
                        className="mb-2">
                        New appointment
                    </Button>
                    <Table responsive bordered striped size="sm">
                        <thead>
                        <tr>
                            <th>Teacher</th>
                            <th>Time</th>
                        </tr>
                        </thead>
                        <tbody>
                        {this.state.meetings.map((meeting, index) =>
                            <tr key={index}>
                                <td>{meeting.teacher.name} {meeting.teacher.surname}</td>
                                <td>{moment(meeting.date).format('Do MMMM [at] HH:mm')}</td>
                            </tr>
                        )}
                        </tbody>
                    </Table>
                </>
                }
            </Container>
        );
    }
}