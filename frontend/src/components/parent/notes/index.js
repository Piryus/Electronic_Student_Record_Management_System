import React from "react";
import {Container, Table} from "react-bootstrap";
import SectionHeader from "../../utils/section-header";
import '@emarkk/hlib';
import LoadingSpinner from "../../utils/loading-spinner";

export default class NotesToParents extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            notes: [],
            isLoading: true
        }
    }

    async componentDidMount() {
        const notes = await this.getNotes();
        this.setState({
            notes,
            isLoading: false
        });
    }

    async componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.child._id !== this.props.child._id) {
            const notes = await this.getNotes();
            this.setState({
                notes,
                isLoading: false
            });
        }
    }

    // Query the notes the teacher has written
    async getNotes() {
        try {
            const url = 'http://localhost:3000/notes/' + this.props.child._id;
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
                <SectionHeader>Notes from teachers</SectionHeader>

                {this.state.isLoading && <LoadingSpinner/>}
                {!this.state.isLoading &&
                <>

                    {Array.isArray(this.state.notes) && this.state.notes.length > 0 &&
                    <Table responsive>
                        <thead>
                        <tr>
                            <th>Date</th>
                            <th>Teacher</th>
                            <th>Note</th>
                        </tr>
                        </thead>
                        <tbody>
                        {this.state.notes.map(note => {
                                return (
                                    <tr key={note._id}>
                                        <td>{new Date(note.date).longString()}</td>
                                        <td>{note.teacher}</td>
                                        <td>{note.description}</td>
                                    </tr>);
                            }
                        )}
                        </tbody>
                    </Table>}

                    {Array.isArray(this.state.notes) && this.state.notes.length === 0 &&
                    <h6>{this.props.child.name} doesn't have any notes from teachers yet!</h6>
                    }
                </>
                }
            </Container>
        );
    }
}