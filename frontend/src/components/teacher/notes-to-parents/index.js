import React from "react";
import {Button, Container, Table} from "react-bootstrap";
import SectionHeader from "../../utils/section-header";
import Select from "react-select";
import NewNoteForm from "./new-note-form";

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
            showNewNoteForm: false
        }
    }

    async componentDidMount() {
        const teacherNotes = await this.getTeacherNotes();
        this.setState({
            teacherNotes
        });
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
            return json.notes;
        } catch (e) {
            console.log(e);
        }
    }

    render() {
        return (
            <Container fluid>
                <SectionHeader>Notes to parents</SectionHeader>

                <Button className='mb-2'
                        onClick={() => this.setState({showNewNoteForm: true})}>
                    Add a note
                </Button>
                <NewNoteForm
                    show={this.state.showNewNoteForm}
                    studentsSearchOptions={this.state.studentsSearchOptions}
                    handleClose={() => this.setState({showNewNoteForm: false})} />

                <Table responsive>
                    <thead>
                    <tr>
                        <th>Date</th>
                        <th>Note</th>
                    </tr>
                    </thead>
                    <tbody>
                    {this.state.teacherNotes.map(note =>
                        <tr key={note._id}>
                            <td>{note.date}</td>
                            <td>{note.description}</td>
                        </tr>
                    )}
                    </tbody>
                </Table>
            </Container>
        );
    }
}