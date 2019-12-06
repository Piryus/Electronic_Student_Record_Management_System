import React from 'react';
import SectionHeader from '../../utils/section-header';
import {Container, Table} from "react-bootstrap";


export default class Material extends React.Component {
    constructor(props){
        super(props);

        this.state = {
            filesMetadata: [    //Hardcoded data
                {
                    fileId: 'fileid',
                    fileName: 'filename',
                    fileSize: 'filesize',
                    subject: 'subjectName'
                }
            ],
            subjects: []
        }

    }

    async componentDidMount(){
        //Load files metadata here
        await this.downloadFileMetadata();
    }

    async downloadFileMetadata(){
        try{}
        catch(e){
            alert('Ops! Internal error.');
        }
    }

    render(){
        return(
            <Container fluid>
                <SectionHeader>Support material</SectionHeader>
            </Container>
        );
    }
}