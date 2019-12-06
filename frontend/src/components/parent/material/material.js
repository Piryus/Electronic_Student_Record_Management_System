import React from 'react';
import SectionHeader from '../../utils/section-header';
import {Container, Table, Dropdown, Form} from "react-bootstrap";
import DownloadFileTable from '../../utils/downloadfiletable/downloadfiletable';


export default class Material extends React.Component {
    constructor(props){
        super(props);

        this.state = {
            selectedSubject: '',
            filesMetadata: [    //Hardcoded data
                {
                    fileId: 'fileid',
                    filename: 'filename',
                    fileSize: 'filesize',
                    subject: 'subjectName'
                }
            ],
            subjects: [
                'subjectName'
            ]
        }

    }

    async componentDidMount(){
        //Load files metadata here
        await this.downloadFileMetadata();
        //Fix subjects here
    }

    async downloadFileMetadata(){
        try{}
        catch(e){
            alert('Ops! Internal error.');
        }
    }

    render(){

        let renderSubjectDropdown = [];

        renderSubjectDropdown = this.state.subjects.map(s => <Dropdown.Item onClick={() => this.setState({selectedSubject: s})}>{s}</Dropdown.Item>);

        return(
            <Container fluid>
                <SectionHeader>Support material</SectionHeader>
                {this.state.filesMetadata.length !== 0 &&
                <Form>
                    <Form.Group>
                        <Form.Label>Subject:</Form.Label>
                        <Dropdown>
                            <Dropdown.Toggle>{this.state.selectedSubject === '' ? 'Select a Subject' : this.state.selectedSubject}</Dropdown.Toggle>
                            <Dropdown.Menu>
                                {renderSubjectDropdown.map(s => s)}
                            </Dropdown.Menu>
                        </Dropdown>
                    </Form.Group>
                    {this.state.selectedSubject !== '' &&
                        <DownloadFileTable type='support-material' files={this.state.filesMetadata.filter(fm => fm.subject === this.state.selectedSubject)}/>
                    }
                </Form>}
                {this.state.filesMetadata.length === 0 &&
                    <i>There is no support material on the portal.</i>
                }
            </Container>
        );
    }
}