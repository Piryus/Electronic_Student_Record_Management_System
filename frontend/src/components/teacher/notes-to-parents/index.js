import React from "react";
import {Button, Container, Table} from "react-bootstrap";
import SectionHeader from "../../utils/section-header";
import Select from "react-select";

export default class NotesToParents extends React.Component {
    constructor(props) {
        super(props);

        const studentsSearchOptions = this.props.students.map(student => {
            return ({
                    value: student,
                    label: student.name + ' ' + student.surname + ' <' + student.ssn + '>'
                });
        });

        this.state = {
            studentsSearchOptions,
            selectedStudent: undefined,
        }
    }

    getStudentNotes() {
        // TODO Fetch notes from backend
    }

    render() {
        //const notes = this.getStudentNotes();
        const notes = [
            {
                _id: 'feds4g89d4',
                date: '12/04/19',
                content: 'Insulted Marco...'
            },
            {
                _id: 'fhzeofoe',
                date: '18/04/19',
                content: 'Showed up late and disturbed the class.'
            },
            {
                _id: 'f65f9ze',
                date: '11/10/19',
                content: 'Does not respect the class materials.'
            }
        ];

        return (
            <Container fluid>
                <SectionHeader>Notes to parents</SectionHeader>
                <h6>Select a student:</h6>
                <Select
                    value={this.state.selectedStudent}
                    options={this.state.studentsSearchOptions}
                    onChange={(value) => this.setState({selectedStudent: value})}
                />
                {this.state.selectedStudent !== undefined &&
                    <div>
                        <Button className='mb-2 mt-2'>Add a note</Button>
                        <Table responsive>
                            <thead>
                                <tr>
                                    <th>Date</th>
                                    <th>Note</th>
                                </tr>
                            </thead>
                            <tbody>
                            {notes.map(note =>
                                <tr key={note._id}>
                                    <td>{note.date}</td>
                                    <td>{note.content}</td>
                                </tr>
                            )}
                            </tbody>
                        </Table>
                    </div>
                }
            </Container>
        );
    }
}