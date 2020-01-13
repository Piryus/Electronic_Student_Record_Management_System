import React from "react";
import {Container} from "react-bootstrap";
import SectionHeader from "../../utils/section-header";
import LoadingSpinner from "../../utils/loading-spinner";
import {Timetable, fetchStudentTimetableData} from "../../utils/timetable";

export default class ChildTimetable extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            timetableData: null,
            isLoading: true
        }
    }

    async componentDidMount() {
        const timetableData = await fetchStudentTimetableData(this.props.child._id);
        this.setState({
            timetableData,
            isLoading: false
        });
    }

    async componentDidUpdate(prevProps, prevState, prevContext) {
        if (prevProps.child !== this.props.child) {
            const timetableData = await fetchStudentTimetableData(this.props.child._id);
            this.setState({
                timetableData
            });
        }
    }

    render() {
        return (
            <Container fluid>
                <SectionHeader>Timetable</SectionHeader>
                {this.state.isLoading && <LoadingSpinner/>}
                {!this.state.isLoading &&
                <Timetable data={this.state.timetableData} frequency={60} hideDate/>
                }
            </Container>
        );
    }
}