import React from 'react';
import {Alert, Button, Container, Dropdown, Form} from 'react-bootstrap';
import 'moment/locale/it.js';
import {DatePickerInput} from 'rc-datepicker';
import 'rc-datepicker/lib/style.css';
import styles from '../student-grades-summary/styles.module.css';
import SectionHeader from "../../utils/section-header";
import HDropzone from "../../utils/hdropzone/hdropzone";

export default class Assignments extends React.Component {


    hourTable = ["08", "09", "10", "11", "12", "13"];

    constructor(props) {
        super(props);

        var today = new Date(Date.now());
        var dd = String(today.getDate()).padStart(2, '0');
        var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
        var yyyy = today.getFullYear();

        today = yyyy + '-' + mm + '-' + dd;

        this.state = {
            wantAddAssignment: false,
            subjects: this.props.subjects,
            selectedSubject: 'Select a subject',
            selectedDate: today,
            currentDay: today,
            description: '',
            selectedWeekhour: null,
            selectedFiles: [],
            success: '',
            warning: '',
            error: ''
        }
        this.selectedFilesHandler = this.selectedFilesHandler.bind(this);
    }

    showFormToAddAssignment() {
        this.setState({wantAddAssignment: true});
    }

    selectedFilesHandler(newSelectedFiles) {
        this.setState({selectedFiles: newSelectedFiles});
    }


    async saveAssignmentIntoDb(day, hour) {
        let effectiveHour = this.hourTable[hour];
        //Send uploaded files here
        try {
            const url = 'http://localhost:3000/assignments';
            const date = new Date(this.state.selectedDate + 'T' + effectiveHour + ':00:00');
            const formData = new FormData();
            formData.append('subject', this.state.selectedSubject);
            formData.append('description', this.state.description);
            formData.append('due', date);
            this.state.selectedFiles.forEach(f => {
                formData.append('attachments', f);
            });
            const options = {
                method: 'POST',
                credentials: 'include',
                body: formData
            };
            let response = await fetch(url, options);
            const json = await response.json();
            if (json.error != null) {
                this.setState({
                    success: '',
                    warning: '',
                    error: 'Ops! Internal error. Please retry!'
                });
            } else {
                this.setState({
                    success: 'The Assignment has been successfully recorded.',
                    warning: '',
                    error: ''
                });
            }
        } catch (err) {
            this.setState({
                success: '',
                warning: '',
                error: err
            });
        }

    }


    async saveChanges(event) {
        event.preventDefault();
        if (this.state.selectedSubject === 'Select a subject') {
            this.setState({
                success: '',
                warning: 'Please select a subject.',
                error: ''
            });
        } else if (this.state.description === '') {
            this.setState({
                success: '',
                warning: 'Please enter a description.',
                error: ''
            });
        } else {
            let currentDay = this.state.currentDay.split('-');
            let chosenDay = this.state.selectedDate.split('-');
            if (parseInt(chosenDay[0]) < parseInt(currentDay[0]) ||
                parseInt(chosenDay[1]) < parseInt(currentDay[1]) && parseInt(chosenDay[0]) === parseInt(currentDay[0]) ||
                parseInt(chosenDay[2]) <= parseInt(currentDay[2]) && parseInt(chosenDay[1]) === parseInt(currentDay[1])) {
                this.setState({
                    success: '',
                    warning: 'Please select a date starting tomorrow.',
                    error: ''
                });
            } else {
                let day = new Date(this.state.selectedDate).getNormalizedDay();
                let toSplit;
                let hour = '';
                this.props.timetable.forEach((t) => {
                    if (t.subject === this.state.selectedSubject && hour === '') {
                        toSplit = t.weekhour.split('_');
                        if (day.toString() === toSplit[0].toString()) {
                            hour = toSplit[1];
                        }
                    }
                });
                if (hour === '') {
                    this.setState({
                        success: '',
                        warning: 'Your subject is not scheduled for this day. Please select a valid day.',
                        error: ''
                    });
                } else {
                    await this.saveAssignmentIntoDb(day, hour);
                    this.setState({
                        wantAddAssignment: false,
                        selectedSubject: 'Select a Subject',
                        description: '',
                        selectedWeekhour: null,
                    });
                }
            }
        }
    }

    onChange = (jsDate, dateString) => {
        let date = dateString.split('T');
        this.setState({selectedDate: date[0]});
    }

    render() {

        let renderDropDownItem = [];
        for (let index in this.state.subjects) {
            renderDropDownItem.push(
                <Dropdown.Item key={index}
                               onClick={() => this.setState({selectedSubject: index})}>{index}</Dropdown.Item>
            );
        }

        return (
            <Container fluid>
                <SectionHeader>Assignments</SectionHeader>
                {this.state.wantAddAssignment === false && (
                    <div>
                        <p>In this section you can manage your assignments</p>
                        {this.state.success !== '' && this.state.warning === '' && this.state.error === '' &&
                        <Alert variant='success'>{this.state.success}</Alert>
                        }
                        <Button variant="primary" onClick={() => this.showFormToAddAssignment()}>New assignment</Button>
                    </div>
                )}
                {this.state.wantAddAssignment === true && (
                    <>
                        <p>Complete the form below to add an assignment</p>
                        {this.state.success === '' && this.state.warning !== '' && this.state.error === '' &&
                        <Alert variant='warning'>{this.state.warning}</Alert>
                        }
                        {this.state.success === '' && this.state.warning === '' && this.state.error !== '' &&
                        <Alert variant='danger'>{this.state.error}</Alert>
                        }
                        <Form>
                            <Form.Group>
                                <Form.Label>Subject</Form.Label>
                                <Dropdown>
                                    <Dropdown.Toggle variant="primary" id="dropdown-basic">
                                        {this.state.selectedSubject}
                                    </Dropdown.Toggle>

                                    <Dropdown.Menu className={styles.dropdownMenu}>
                                        {renderDropDownItem.map((item) => {
                                            return item;
                                        })}
                                    </Dropdown.Menu>
                                </Dropdown>
                            </Form.Group>
                            <Form.Group>
                                <Form.Label>Date</Form.Label>
                                <DatePickerInput
                                    onChange={this.onChange}
                                    value={this.state.selectedDate}
                                />
                            </Form.Group>
                            <Form.Group>
                                <Form.Label>Description</Form.Label>
                                <Form.Control placeholder="Insert a description here." as="textarea" rows="3"
                                              onChange={(e) => this.setState({description: e.target.value})}/>
                            </Form.Group>
                            <HDropzone
                                selectedFilesHandler={(newSelectedFiles) => this.selectedFilesHandler(newSelectedFiles)}
                                selectedFiles={this.state.selectedFiles}/>
                            <Button onClick={(e) => this.saveChanges(e)} type="primary">Save</Button>
                        </Form>
                    </>
                )}
            </Container>
        );
    }
}