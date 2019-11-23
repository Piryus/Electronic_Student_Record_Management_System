import React from 'react';
import {Button, Form, Dropdown} from 'react-bootstrap';
import styles from '../student-grades-summary/styles.module.css';



export default class Assignments extends React.Component{

    constructor(props){
        super(props);
        this.state = {
            wantAddAssignment: false,
            subjects: this.props.subjects,
            selectedSubject: 'Select a Subject',
            description: 'Insert a description here'
        }
    }

    showFormToAddAssignment(){
        this.setState({wantAddAssignment: true});
    }

    render(){

        let renderDropDownItem = [];
        for(let index in this.state.subjects){
            renderDropDownItem.push(
                <Dropdown.Item onClick={() => this.setState({selectedSubject: index})}>{index}</Dropdown.Item>
            );
        }

        return (
            <div>
                <h1>Assignments</h1>
                {this.state.wantAddAssignment === false &&(
                    //We should display here already recorded assignments
                    <div>
                        <p>Display Assignments here grouped by subject</p><br></br>
                        <Button variant="primary" onClick={() => this.showFormToAddAssignment()}>Add an Assignment</Button>
                    </div>
                )}
                {this.state.wantAddAssignment === true &&(
                    <div>
                        <p>Complete the form below to add an Assignment</p><br></br>
                        <Form>
                            <Form.Group>
                                <Form.Label>Subject: </Form.Label>
                                <Dropdown>
                                    <Dropdown.Toggle variant="primary" id="dropdown-basic">
                                        {this.state.selectedSubject}
                                    </Dropdown.Toggle>

                                    <Dropdown.Menu className={styles.dropdownMenu}>
                                        {renderDropDownItem.map((item) => {
                                            return item;
                                        })}
                                    </Dropdown.Menu>
                                </Dropdown>
                            </Form.Group>
                            <Form.Group>
                                <Form.Label>
                                    Description:
                                </Form.Label>
                                <Form.Control placeholder="Insert a description here." as="textarea" rows="3" onChange={(e) => this.setState({description: e.target.value}) }/>
                            </Form.Group>
                        </Form>
                    </div>
                )}
            </div>
        );
    }
}