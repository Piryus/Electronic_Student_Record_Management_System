import React from 'react';
import SectionHeader from '../section-header';
import EarlyLateTable from '../earlyLateTable/earlyLateTable';
import Select from 'react-select';
import {Alert, Button, Container, Form, FormControl, InputGroup, Row, Table} from 'react-bootstrap';
import styles from './styles.module.css';


export default class EarlyLateRecordComponent extends React.Component {

    constructor(props) {
        super(props);

        let whs = [];
        whs = this.props.timetable.map(t => t.weekhour);
        whs = whs.filter(wh => parseInt(wh.charAt(0)) === this.props.now);
        whs = whs.map(dh => parseInt(dh.charAt(2)));

        this.state = {
            classId: this.props.classId,
            classStudents: [],
            selectedStudent: '',
            selectedhh: '',
            selectedmm: '',
            addedStudents: [],
            searchOptions: [],
            wantSeeEvents: false,
            workingHours: whs,
            success: '',
            error: '',
            warning: ''
        }
        this.handleWantSeeEvents = this.handleWantSeeEvents.bind(this);
    }

    async componentDidMount() {
        if (this.state.classId !== '') {
            await this.getClassStudents();
            this.computeSearchOptions();
        }
    }

    handleWantSeeEvents() {
        this.setState({wantSeeEvents: false});
    }

    computeSearchOptions() {
        let options = [];
        this.state.classStudents.forEach((student) => {
            let option = {
                value: student,
                label: student.name + ' ' + student.surname + ' <' + student.ssn + '>'
            };
            options.push(option);
        });
        this.setState({
            searchOptions: options
        });
    }


    async getClassStudents() {
        try {
            const url = 'http://localhost:3000/students?classId=' + this.state.classId;
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
                classStudents: json.students
            });
        } catch (e) {
            this.setState({
                error: e,
                warning: '',
                success: ''
            });
        }
    }

    addStudent() {
        if (this.state.selectedStudent === '') {
            this.setState({
                error: '',
                warning: 'Please select a student.',
                success: ''
            });

        } else if (this.state.selectedhh === '' || this.state.selectedmm === '') {
            this.setState({
                error: '',
                warning: 'Please please insert hour and minutes.',
                success: ''
            });
        } else if (isNaN(this.state.selectedhh) || isNaN(this.state.selectedmm)) {
            this.setState({
                error: '',
                warning: 'Please insert valid hour and minutes in the format [hh] and [mm].',
                success: ''
            });
        } else if (this.state.selectedhh.length > 2 || this.state.selectedmm.length > 2) {
            this.setState({
                error: '',
                warning: 'Please insert valid hour and minutes in the format [hh] and [mm].',
                success: ''
            });
        } else if (parseInt(this.state.selectedhh) < 8 || parseInt(this.state.selectedhh) > 13) {
            this.setState({
                error: '',
                warning: 'Please insert a valid working hour.',
                success: ''
            });
        } else if (parseInt(this.state.selectedmm) < 0 || parseInt(this.state.selectedmm) > 59) {
            this.setState({
                error: '',
                warning: 'Please insert valid minutes.',
                success: ''
            });
        } else {
            let addedStudents = this.state.addedStudents;
            let alreadyExists = addedStudents.find(s => s.student._id.toString() === this.state.selectedStudent.value._id.toString());
            if (alreadyExists !== undefined && alreadyExists !== null) {
                this.setState({
                    error: 'Student already added to list.',
                    warning: '',
                    success: ''
                });
            } else {
                let hh = this.state.selectedhh.length === 1 ? '0' + this.state.selectedhh : this.state.selectedhh;
                let mm = this.state.selectedmm.length === 1 ? '0' + this.state.selectedmm : this.state.selectedmm;
                let completeHour = hh + ':' + mm;
                if (this.props.type === 'early-exit' && !this.state.workingHours.includes(parseInt(hh) - 8)) {
                    this.setState({
                        error: '',
                        warning: 'Input hour not valid. You can insert hour values included in your working timetable only.',
                        success: ''
                    });
                } else if (this.props.type === 'late-entrance' && !/^(08:(0[1-9]|10))$/.test(completeHour) && this.state.workingHours.includes(0) && !this.state.workingHours.includes(1)) {
                    //First hour teacher
                    this.setState({
                        error: '',
                        warning: 'Only Range [ 08:01 - 08:10 ] is allowed for teacher working in the first hour.',
                        success: ''
                    });
                } else if (this.props.type === 'late-entrance' && !/^(09:00)$/.test(completeHour) && !this.state.workingHours.includes(0) && this.state.workingHours.includes(1)) {
                    //Second hour teacher
                    this.setState({
                        error: '',
                        warning: 'Only value [ 09:00 ] is allowed for teacher working in the second hour.',
                        success: ''
                    });
                } else if (this.props.type === 'late-entrance' && !/^(08:(0[1-9]|10)|09:00)$/.test(completeHour) && this.state.workingHours.includes(0) && this.state.workingHours.includes(1)) {
                    this.setState({
                        error: '',
                        warning: 'Only Range [ 08:01 - 08:10 ] and value [ 09:00 ] are allowed for teacher working in the first two hours.',
                        success: ''
                    });
                } else {
                    addedStudents.push({
                        student: this.state.selectedStudent.value,
                        hh: hh,
                        mm: mm
                    });
                    //Sort eventually here
                    this.setState({
                        addedStudents: addedStudents,
                        selectedStudent: '',
                        selectedhh: '',
                        selectedmm: ''
                    });
                }
            }

        }

    }

    async saveChanges() {
        let vector = this.state.addedStudents.map(s => {
            return {
                studentId: s.student._id,
                time: s.hh + ':' + s.mm,
                attendanceEvent: this.props.type === 'late-entrance' ? 'late-entrance' : 'early-exit'
            };
        });
        let dataToSend = {
            classId: this.state.classId,
            info: vector
        }
        await this.pushDataToDb(dataToSend);
        this.setState({
            addedStudents: [],
            selectedStudent: '',
            selectedhh: '',
            selectedmm: ''
        });
    }

    async pushDataToDb(dataToSend) {
        try {
            const url = 'http://localhost:3000/attendance';
            const jsonToSend = JSON.stringify(dataToSend);
            const options = {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: jsonToSend
            };
            let response = await fetch(url, options);
            const json = await response.json();
            if (json.error != null) {
                this.setState({
                    error: 'Ops! Internal error. Please retry!',
                    warning: '',
                    success: ''
                });
            } else {
                this.setState({
                    error: '',
                    warning: '',
                    success: 'Event successfully recorded.'
                });
            }
        } catch (err) {
            this.setState({
                error: err,
                warning: '',
                success: ''
            });
        }
    }

    discardChanges() {
        this.setState({
            addedStudents: [],
            selectedStudent: '',
            selectedhh: '',
            selectedmm: ''
        });
    }

    removeItem(id) {
        let addedStudents = this.state.addedStudents.filter(s => s.student._id !== id);
        this.setState({addedStudents: addedStudents});
    }


    render() {

        return (
            <Container fluid>
                {this.props.type === 'late-entrance' && (
                    <SectionHeader>Late Entrance</SectionHeader>
                )}
                {this.props.type === 'early-exit' && (
                    <SectionHeader>Early Exit</SectionHeader>
                )}
                {this.state.wantSeeEvents === false && (
                    <div>
                        {this.state.success !== '' && this.state.warning === '' && this.state.error === '' &&
                        <Alert variant='success'>{this.state.success}</Alert>
                        }
                        {this.state.success === '' && this.state.warning !== '' && this.state.error === '' &&
                        <Alert variant='warning'>{this.state.warning}</Alert>
                        }
                        {this.state.success === '' && this.state.warning === '' && this.state.error !== '' &&
                        <Alert variant='danger'>{this.state.error}</Alert>
                        }
                        <Row>
                            <Button variant="outline-primary" onClick={() => this.setState({wantSeeEvents: true})}>See
                                recorded Daily Events</Button>
                            {this.state.addedStudents.length !== 0 && (
                                <Button variant="success" className={styles.dangerButton}
                                        onClick={() => this.saveChanges()}>Save Changes</Button>)}
                            {this.state.addedStudents.length !== 0 && (
                                <Button variant="danger" className={styles.dangerButton}
                                        onClick={() => this.discardChanges()}>Discard</Button>)}
                        </Row>
                        <br></br>
                        <i>Fill all the fields in the form here below to create an event for a student.</i>
                        <Form>
                            <Form.Group>
                                <Form.Label>Search a Student</Form.Label>
                                <Select
                                    value={this.state.selectedStudent}
                                    options={this.state.searchOptions}
                                    onChange={(selectedStudent) => this.setState({selectedStudent})}
                                /><br></br>
                            </Form.Group>
                            <Form.Group>
                                <InputGroup responsive>
                                    <InputGroup.Prepend>
                                        <InputGroup.Text>Time:</InputGroup.Text>
                                    </InputGroup.Prepend>
                                    <FormControl placeholder='hh' value={this.state.selectedhh}
                                                 onChange={(e) => this.setState({selectedhh: e.target.value})}/>
                                    <FormControl placeholder='mm' value={this.state.selectedmm}
                                                 onChange={(e) => this.setState({selectedmm: e.target.value})}/>
                                </InputGroup>
                            </Form.Group>

                            <Button variant="primary" onClick={() => this.addStudent()}>Add Student</Button>


                        </Form><br></br>
                        <i>In this table here below you can see students whose event you want to record.</i>
                        <Table responsive>
                            <thead>
                            <tr>
                                <th>Surname</th>
                                <th>Name</th>
                                <th>SSN</th>
                                <th>Hour</th>
                                <th></th>
                            </tr>
                            </thead>
                            <tbody>
                            {this.state.addedStudents.length === 0 &&
                            <i>No students have been added yet.</i>
                            }
                            {this.state.addedStudents.map((s, idx) => {
                                return (<tr key={idx}>
                                    <td>{this.state.addedStudents[idx].student.surname}</td>
                                    <td>{this.state.addedStudents[idx].student.name}</td>
                                    <td>{this.state.addedStudents[idx].student.ssn}</td>
                                    <td>{this.state.addedStudents[idx].hh + ':' + this.state.addedStudents[idx].mm}</td>
                                    <td><Button variant="danger" size="sm"
                                                onClick={() => this.removeItem(this.state.addedStudents[idx].student._id)}>Remove</Button>
                                    </td>
                                </tr>);
                            })}
                            </tbody>
                        </Table>
                    </div>)}
                {this.state.wantSeeEvents === true && (
                    <EarlyLateTable dontWantSeeEvents={this.handleWantSeeEvents}
                                    classStudents={this.state.classStudents} type={this.props.type}
                                    whs={this.state.workingHours} now={this.props.now} classId={this.state.classId}/>
                )}
            </Container>
        );
    }
}