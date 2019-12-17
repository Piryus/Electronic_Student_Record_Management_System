import React from "react";
import {Spinner} from "react-bootstrap";

export default class LoadingSpinner extends React.Component {
    render() {
        return (
            <div className="d-flex">
                <Spinner animation="border" className="mx-auto"/>
            </div>
        );
    }
}