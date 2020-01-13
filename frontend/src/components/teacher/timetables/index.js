import React from "react";
import {Container, Dropdown, DropdownButton} from "react-bootstrap";
import SectionHeader from "../../utils/section-header";
import Timetable, {fetchClassTimetableData} from "../../utils/timetable";
import LoadingSpinner from "../../utils/loading-spinner";

export default class ClassesTimetables extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedClass: {},
            isLoading: true,
            timetableData: null,
            classes: []
        }
    }

    async componentDidMount() {
        const {classes, teacherTimetable} = this.props;
        let teacherClasses = classes.filter(c => teacherTimetable.find(t => t.classId === c._id) !== undefined);
        let timetableData = null;
        let selectedClass = {};
        if (teacherClasses.length > 0) {
            timetableData = await fetchClassTimetableData(teacherClasses[0]._id);
            selectedClass = teacherClasses[0];
        }
        this.setState({
            timetableData,
            isLoading: false,
            classes: teacherClasses,
            selectedClass
        });
    }

    async selectClass(class_) {
        const timetableData = await fetchClassTimetableData(class_._id);
        this.setState({
            selectedClass: class_,
            timetableData
        });
    }

    render() {
        return (
            <Container fluid>
                <SectionHeader>Classes timetables</SectionHeader>
                {this.state.isLoading && <LoadingSpinner/>}
                {!this.state.isLoading &&
                <>
                    <DropdownButton className='mb-2'
                                    title={this.state.selectedClass !== {} ? this.state.selectedClass.name : 'Select a class'}>
                        {this.state.classes.map(class_ =>
                            <Dropdown.Item
                                key={class_._id}
                                onClick={async () => await this.selectClass(class_)}>{class_.name}</Dropdown.Item>
                        )}
                    </DropdownButton>
                    {this.state.timetableData !== null &&
                    <Timetable data={this.state.timetableData} frequency={60} hideDate/>}
                </>
                }
            </Container>
        );
    }
}