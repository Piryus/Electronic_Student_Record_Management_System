import React from 'react';
import {Button, Container, Table} from 'react-bootstrap';
import SectionHeader from "../../utils/section-header";
import LoadingSpinner from "../../utils/loading-spinner";
import NewAppointmentModal from "./new-appointment-modal";

export default class Meetings extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showNewAppointmentModal: false,
            isLoading: false
        }
    }

    render() {
        return (
            <Container fluid>
                <SectionHeader>Meetings with teachers</SectionHeader>
                {this.state.isLoading && <LoadingSpinner/>}
                {!this.state.isLoading &&
                <>
                    <NewAppointmentModal show={this.state.showNewAppointmentModal}
                                         onClose={() => this.setState({showNewAppointmentModal: false})}/>
                    <Button
                        onClick={() => this.setState({showNewAppointmentModal: true})}
                        className="mb-2">
                        New appointment
                    </Button>
                    <Table responsive bordered striped size="sm">
                        <thead>
                        <tr>
                            <th>Teacher</th>
                            <th>Child</th>
                            <th>Time</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr>
                            <td>Marco Rosso</td>
                            <td>Julia</td>
                            <td>7th January at 14:00</td>
                        </tr>
                        <tr>
                            <td>Marco Rosso</td>
                            <td>Pierro</td>
                            <td>7th January at 15:00</td>
                        </tr>
                        </tbody>
                    </Table>
                </>
                }
            </Container>
        );
    }
}