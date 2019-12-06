import React from 'react';
import {Table, Button} from "react-bootstrap";
import {FaDownload} from 'react-icons/fa';



export default class DownloadFileTable extends React.Component {
    constructor(props){
        super(props);
    }

    downloadFile(event, f){
        event.preventDefault();
        var file_path = "http://localhost:3000/file/" + f._id.toString();
        var a = document.createElement('A');
        a.href = file_path;
        a.download = file_path.substr(file_path.lastIndexOf('/') + 1);
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    }

    render(){
        return(
            <Table striped responsive>
                {this.props.type === 'support-material' && 
                <thead>
                    <tr>
                        <th>Filename</th>
                        <th>Download</th>
                    </tr>
                </thead> }
                <tbody>
                {this.props.files.map((f, index) => {
                     return (
                        <tr>
                            <td style={{textDecoration: 'underline'}}>
                                {f.filename}
                            </td>
                            <td>
                                <Button size="sm" variant="outline-primary" onClick={(event) => this.downloadFile(event, f)}><FaDownload/></Button>
                            </td>
                        </tr>
                    );
                })}
                </tbody>
            </Table>
        );
    }
}