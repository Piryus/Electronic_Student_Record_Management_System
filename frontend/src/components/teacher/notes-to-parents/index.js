import React from "react";
import {Button, Container, Table} from "react-bootstrap";
import SectionHeader from "../../utils/section-header";
import NewNoteForm from "./new-note-form";
import '@emarkk/hlib';
import LoadingSpinner from "../../utils/loading-spinner";

export default class NotesToParents extends React.Component {
    constructor(props) {
        super(props);

        // Compute students search options for the student search bar select
        const studentsSearchOptions = this.props.students.map(student => {
            return ({
                value: student,
                label: student.name + ' ' + student.surname + ' <' + student.ssn + '>'
            });
        });

        this.state = {
            studentsSearchOptions,
            selectedStudent: undefined,
            selectedStudentNotes: [],
            teacherNotes: [],
            showNewNoteForm: false,
            isLoading: true
        }
    }

    async componentDidMount() {
        await this.getTeacherNotes();
    }

    // Query the notes the teacher has written
    async getTeacherNotes() {
        try {
            const url = 'http://localhost:3000/notes';
            const options = {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
            };
            const response = await fetch(url, options);
            const json = await response.json();
            this.setState({
                teacherNotes: json.notes,
                isLoading: false
            });
        } catch (e) {
            console.log(e);
        }
    }

    render() {
        return (
            <Container fluid>
                <SectionHeader>Notes to parents</SectionHeader>

                {this.state.isLoading && <LoadingSpinner/>}
                {!this.state.isLoading &&
                <>
                    <Button className='mb-2'
                            onClick={() => this.setState({showNewNoteForm: true})}>
                        Add a note
                    </Button>
                    <NewNoteForm
                        show={this.state.showNewNoteForm}
                        studentsSearchOptions={this.state.studentsSearchOptions}
                        handleClose={async () => {this.getTeacherNotes(); this.setState({showNewNoteForm: false})}}/>

                    {Array.isArray(this.state.teacherNotes) && this.state.teacherNotes.length > 0 &&
                    <Table responsive>
                        <thead>
                        <tr>
                            <th>Date</th>
                            <th>Student</th>
                            <th>Note</th>
                        </tr>
                        </thead>
                        <tbody>
                        {this.state.teacherNotes.map(note => {
                                const student = this.props.students.find(student => student._id === note.studentId);
                                return (
                                    <tr key={note.date + note.teacherId}>
                                        <td>{new Date(note.date).longString()}</td>
                                        <td>{student.name + ' ' + student.surname}</td>
                                        <td>{note.description}</td>
                                    </tr>);
                            }
                        )}
                        </tbody>
                    </Table>}

                    {Array.isArray(this.state.teacherNotes) && this.state.teacherNotes.length === 0 &&
                    <h6>You didn't submit any notes yet!</h6>
                    }
                </>
                }
            </Container>
        );
    }
}