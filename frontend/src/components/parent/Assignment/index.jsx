import React, { Component } from 'react';
import './style.sass';
import {Accordion, Card} from "react-bootstrap";

class Assignment extends Component {


  constructor(props) {
    super(props);
    this.state = {
      childAssignment: [],
    }
  }

   async componentDidMount() {
    await this.getChildAssignment();
  } 


  async getChildAssignment() {
    // Query child's assignments
    const url = 'http://localhost:3000/assignments/' + this.props.child._id;
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
    this.setState({
       childAssignment: json.assignments
    });
  }

  renderItem = (item, index) => {
    return (
      <Card>
        <Accordion.Toggle as={Card.Header} eventKey= {index.toString()}>
    <div class= "flexContainer"><div class= "flexContent" style= {{width: "30%"}}>{item.subject}</div> <div class= "flexContent" style= {{width: "30%"}}>{item.assigned}</div> <div class= "flexContent" style= {{color: "red", width: "30%"}}>{item.due}</div></div>
        </Accordion.Toggle>
        <Accordion.Collapse eventKey= {index.toString()}>
        <Card.Body>{item.description}</Card.Body>
        </Accordion.Collapse>
      </Card>
    );
  }

  

   render() {
     //Handle data from backend especially date. Likely sort by date
     let output;
     let temp;
     let store= this.state.childAssignment;
    if (Array.isArray(store) && store.length) {
      store.sort(function(a, b){
        return new Date(a) - new Date(b);
      });
      store.map((item)=>{
        let tmp= [];
        tmp= item.due.split("T");
        item.due= tmp[0];
        tmp= item.assigned.split("T");
        item.assigned= tmp[0];
      })
      output= (
      <Accordion>
         <Card>
         <Accordion.Toggle as={Card.Header} >
       <div class= "flexContainer"><div class= "flexContent" style= {{width: "30%", fontWeight: "bold"}}>Subject</div> <div class= "flexContent" style= {{width: "30%", fontWeight: "bold"}}>Published</div> <div class= "flexContent" style= {{width: "30%", fontWeight: "bold"}}>Deadline</div></div>
       </Accordion.Toggle>
       </Card>
       { store.map(this.renderItem) }
       </Accordion>
      ) 
    }
    else{/*
      output= <h3 style= {{color: "red"}}>You currently have no pending assignments!!!!</h3>
    */}
    
    
    return (
      <div style= {{width: "80%", margin: "0 auto"}}>
        <h2 style= {{textAlign: "center"}}>Assignments</h2>
        <br /><br />
       { output }
    </div>
    )
  }
}

export default Assignment;
