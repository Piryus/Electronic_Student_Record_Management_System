import React from "react";
import {Container} from "react-bootstrap";
import SectionHeader from "../../utils/section-header";
import Timetable from "../../utils/timetable";

export default class Meetings extends React.Component {
    constructor(props) {
        super(props);

    }

    render() {
        return (
            <Container fluid>
                <SectionHeader>Meetings with parents</SectionHeader>
                <h6>Select the time slots you are available to meet parents</h6>
                {/*<Timetable />*/}
            </Container>
        );
    }
}