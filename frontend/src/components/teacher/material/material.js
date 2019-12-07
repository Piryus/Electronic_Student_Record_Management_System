import React from 'react';
import {Button, Container, Form, Dropdown, Alert} from "react-bootstrap";
import SectionHeader from "../../utils/section-header";
import HDropzone from "../../utils/hdropzone/hdropzone";

export default class Material extends React.Component {
    constructor(props){
        super(props);

        let teacherClasses = [];
        teacherClasses = this.props.classes.filter(c => this.props.timetable.find(t => t.classId === c._id) === undefined ? false : true);

        this.state = {
            selectedFiles: [],
            classes: teacherClasses,
            selectedDescription: '',
            selectedClass: '',
            selectedSubject: '',
            requestSatisfied: false
        }
        this.selectedFilesHandler = this.selectedFilesHandler.bind(this);
    }

    selectedFilesHandler(newSelectedFiles){
        this.setState({selectedFiles: newSelectedFiles});
    }

    async uploadMaterial(event){
        event.preventDefault();
        if(this.state.selectedDescription === ''){
            alert('Please insert a Description first.');
        } else {
            //Prepare payload to send here
            await this.pushMaterialToDb();
            this.setState({
                selectedFiles: [],
                selectedDescription: '',
                selectedClass: '',
                selectedSubject: '',
                requestSatisfied: false
            });
        }
    }

    async pushMaterialToDb(){
        try{
            //Send data to backend here
        }
        catch(e){
            alert('Ops. Internal error.');
        }
    }

    render(){
        let renderClassDropdownMenu = [];
        let renderSubjects = [];

        renderClassDropdownMenu = this.state.classes.map(c => <Dropdown.Item onClick={() => this.setState({selectedClass: c})}>{c.name}</Dropdown.Item>);
        if(this.state.selectedClass !== ''){
            renderSubjects = this.props.timetable.filter(t => t.classId === this.state.selectedClass._id).map(t => t.subject);
            renderSubjects = [...new Set(renderSubjects)];
            renderSubjects = renderSubjects.map(s => <Dropdown.Item onClick={() => this.setState({selectedSubject: s})}>{s}</Dropdown.Item>);
        }
        
        return(
            <Container fluid>
                <SectionHeader>Support material</SectionHeader>
                {this.state.requestSatisfied === true &&
                    <Alert variant="success">Support Material uploaded successfully.</Alert>
                }
                <p>This section is to be used to upload the <i>Support Material.</i></p><br />
                {this.state.selectedFiles.length !== 0 &&
                    <Button variant="outline-success" onClick={(event) => this.uploadMaterial(event)}>Upload Material</Button>
                }
                <Form>
                    <Form.Group>
                        <Form.Label>Class:</Form.Label>
                        <Dropdown>
                            <Dropdown.Toggle variant="primary" id="dropdown-basic">
                                {this.state.selectedClass === '' ? 'Select a class' : this.state.selectedClass.name}
                            </Dropdown.Toggle>
                            <Dropdown.Menu>
                                {renderClassDropdownMenu.map(c => c)}
                            </Dropdown.Menu>
                        </Dropdown>
                    </Form.Group>
                    {this.state.selectedClass !== '' &&
                        <Form.Group>
                            <Form.Label>Subject:</Form.Label>
                            <Dropdown>
                                <Dropdown.Toggle variant="primary" id="dropdown-basic">
                                    {this.state.selectedSubject === '' ? 'Select a subject' : this.state.selectedSubject}
                                </Dropdown.Toggle>
                                <Dropdown.Menu>
                                    {renderSubjects.map(s => s)}
                                </Dropdown.Menu>
                            </Dropdown>
                        </Form.Group>
                    }
                    {this.state.selectedSubject !== '' &&
                    <React.Fragment>
                        <Form.Group>
                            <Form.Label>Description:</Form.Label>
                            <Form.Control placeholder="Insert a description here." rows="3"
                                onChange={(e) => this.setState({selectedDescription: e.target.value})}/>
                        </Form.Group>
                        <HDropzone selectedFilesHandler={(newSelectedFiles) => this.selectedFilesHandler(newSelectedFiles)} selectedFiles={this.state.selectedFiles}></HDropzone>
                    </React.Fragment>
                    }

                </Form>
            </Container>
        );
    }
}