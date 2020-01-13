import React from 'react';
import {Table, Button} from "react-bootstrap";
import {FaDownload} from 'react-icons/fa';



export default class DownloadFileTable extends React.Component {
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
            <Table striped responsive>
                <thead>
                    <tr>
                        <th>Filename</th>
                        {this.props.type === 'assignment' ? null : <th>Description</th>}
                        <th>Size</th>
                        <th>Download</th>
                    </tr>
                </thead>
                <tbody>
                {this.props.files.map((f, index) => {
                     return (
                        <tr key={f.filename + f.bytes + index}>
                            <td style={{textDecoration: 'underline'}}>
                                {f.filename}
                            </td>
                            {this.props.type === 'support-material' &&<td>{f.description}</td>}
                            <td>{this.formatBytes(f.bytes)}</td>
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