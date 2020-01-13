import React from 'react';
import SectionHeader from '../../utils/section-header';
import {Container, Dropdown, Form} from "react-bootstrap";
import DownloadFileTable from '../../utils/downloadfiletable/downloadfiletable';


export default class Material extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            selectedSubject: '',
            realFilesMetadata: [],
            subjects: [],
            wantedFiles: []
        }

    }

    async componentDidMount() {
        let filesMetadata = await this.downloadFileMetadata();
        let filesPerSubject = this.getSubjects(filesMetadata);
        this.setState({
            realFilesMetadata: filesPerSubject,
        });
    }

    getSubjects(filesMetadata) {
        let filesPerSubject = [];
        for (var i in filesMetadata) {
            filesPerSubject.push({
                subject: i,
                files: filesMetadata[i].map(f => {
                    return {
                        description: f.description,
                        filename: f.attachments[0].filename,
                        _id: f.attachments[0]._id,
                        bytes: f.attachments[0].bytes
                    };
                })
            });
        }
        return filesPerSubject;
    }

    async downloadFileMetadata() {
        const url = 'http://localhost:3000/material/' + this.props.child._id;
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
        return json.supportMaterials;
    }

    render() {
        let renderSubjectDropdown = this.state.realFilesMetadata.map(s =>
            <Dropdown.Item onClick={() => this.setState({
                selectedSubject: s.subject,
                wantedFiles: s.files
            })}
                           key={s.subject}>{s.subject}</Dropdown.Item>);

        return (
            <Container fluid>
                <SectionHeader>Support material</SectionHeader>
                {this.state.realFilesMetadata.length !== 0 &&
                <Form>
                    <Form.Group>
                        <Dropdown>
                            <Dropdown.Toggle>{this.state.selectedSubject === '' ? 'Select a subject...' : this.state.selectedSubject}</Dropdown.Toggle>
                            <Dropdown.Menu>
                                {renderSubjectDropdown.map(s => s)}
                            </Dropdown.Menu>
                        </Dropdown>
                    </Form.Group>
                    {this.state.selectedSubject !== '' &&
                    <DownloadFileTable type='support-material' files={this.state.wantedFiles}/>
                    }
                </Form>}
                {this.state.realFilesMetadata.length === 0 &&
                <i>There is no support material on the portal.</i>
                }
            </Container>
        );
    }
}