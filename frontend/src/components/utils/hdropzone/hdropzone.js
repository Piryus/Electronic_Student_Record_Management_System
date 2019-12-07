import React, {createRef} from 'react';
import Dropzone from 'react-dropzone';
import {Button, Form, Container, Alert, Table} from 'react-bootstrap';


export default class HDropzone extends React.Component {
    constructor(props){
        super(props);

        this.state = {
            selectedFiles: this.props.selectedFiles,
        }
    }

    componentWillReceiveProps(nextProps) {
        this.setState({ selectedFiles: nextProps.selectedFiles });  
    }

    dropzoneRef = createRef();
    openDialog = () => {
        if (this.dropzoneRef.current) {
            this.dropzoneRef.current.open()
        }
    };

    onDrop = (droppedFiles) => {
        let currentFiles = this.state.selectedFiles;
        currentFiles = currentFiles.concat(droppedFiles);
        this.props.selectedFilesHandler(currentFiles);
    }

    removeFile(event, index){
        event.preventDefault();
        let currentFiles = this.state.selectedFiles;
        if(currentFiles.length === 1){
            currentFiles = [];
        } else{
            currentFiles.splice(index, 1);
        }
        this.props.selectedFilesHandler(currentFiles);
    }

    formatBytes(bytes, decimals = 2) {
        if (bytes === 0) return '0 Bytes';
    
        const k = 1024;
        const dm = decimals < 0 ? 0 : decimals;
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    
        const i = Math.floor(Math.log(bytes) / Math.log(k));
    
        return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
    }

    render(){
        return(
            <React.Fragment>
                <Form.Group>
                                <Form.Label>
                                    {this.state.selectedFiles.length === 0 ? 'Upload files:' : 'Drag \'n\' drop some files here below, or click inside the grey area to select files.'}
                                </Form.Label><br></br>
                                <Button  size="sm" variant="outline-secondary" onClick={this.openDialog}>Select a file</Button><br></br><br></br>
                                <Alert variant='light'>
                                <Dropzone onDrop={acceptedFiles => this.onDrop(acceptedFiles)} ref={this.dropzoneRef} noClick noKeyboard>
                                    {({getRootProps, getInputProps, acceptedFiles}) => (
                                        <div className="container">
                                            <div {...getRootProps({className: 'dropzone'})}>
                                                <input {...getInputProps()} />
                                                {this.state.selectedFiles.length === 0 &&(
                                                    <React.Fragment>
                                                        <p style={{textAlign: 'center'}}>Drag 'n' drop some files here,</p>
                                                        <p style={{textAlign: 'center'}}>or press "Select a file" button.</p>
                                                    </React.Fragment>
                                                )}
                                                {this.state.selectedFiles.length !== 0 && (
                                                    <div>
                                                        <Table borderless responsive>
                                                            <thead>
                                                            <tr>
                                                                <th>File name</th>
                                                                <th>File size</th>
                                                                <th></th>
                                                            </tr>
                                                            </thead>
                                                            <tbody>
                                                            {this.state.selectedFiles.map((f, index) => <tr>
                                                            <td>{f.name}</td>
                                                            <td>{this.formatBytes(f.size)}</td>
                                                            <td><Button variant="danger" size="sm" type="primary" onClick={(event) => this.removeFile(event,index)}>Remove</Button></td>
                                                        </tr>)}
                                                            </tbody>
                                                        </Table>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </Dropzone>
                                </Alert>
                            </Form.Group>
            </React.Fragment>
        );
    }
}