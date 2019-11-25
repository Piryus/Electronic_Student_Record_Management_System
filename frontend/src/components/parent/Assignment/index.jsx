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

  tmp = [
    {
      subject: "Physics",
      description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum",
      assigned: "10/11/2019",
      due: "20/11/2019",
    },
    {
      subject: "Chemistry",
      description: "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like).",
      assigned: "18/11/2019",
      due: "24/11/2019",
    },
    {
      subject: "Biology",
      description: "There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable. If you are going to use a passage of Lorem Ipsum, you need to be sure there isn't anything embarrassing hidden in the middle of text. All the Lorem Ipsum generators on the Internet tend to repeat predefined chunks as necessary, making this the first true generator on the Internet. It uses a dictionary of over 200 Latin words, combined with a handful of model sentence structures, to generate Lorem Ipsum which looks reasonable. The generated Lorem Ipsum is therefore always free from repetition, injected humour, or non-characteristic words etc.",
      assigned: "22/11/2019",
      due: "30/11/2019",
    },
    {
      subject: "Geography",
      description: "There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable. If you are going to use a passage of Lorem Ipsum, you need to be sure there isn't anything embarrassing hidden in the middle of text. All the Lorem Ipsum generators on the Internet tend to repeat predefined chunks as necessary, making this the first true generator on the Internet. It uses a dictionary of over 200 Latin words, combined with a handful of model sentence structures, to generate Lorem Ipsum which looks reasonable. The generated Lorem Ipsum is therefore always free from repetition, injected humour, or non-characteristic words etc.",
      assigned: "13/11/2019",
      due: "24/11/2019",
    },
    {
      subject: "Italian",
      description: "There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable. If you are going to use a passage of Lorem Ipsum, you need to be sure there isn't anything embarrassing hidden in the middle of text. All the Lorem Ipsum generators on the Internet tend to repeat predefined chunks as necessary, making this the first true generator on the Internet. It uses a dictionary of over 200 Latin words, combined with a handful of model sentence structures, to generate Lorem Ipsum which looks reasonable. The generated Lorem Ipsum is therefore always free from repetition, injected humour, or non-characteristic words etc.",
      assigned: "12/11/2019",
      due: "25/11/2019",
    },
  ];

   async componentDidMount() {
    await this.getChildAssignment();
  } 


  async getChildAssignment() {
    this.setState({
      childAssignment: this.tmp//to be removed, for static display purpose
    });
    // Query child's assignments
    const url = 'http://localhost:3000/assignment/';// + this.props.child._id;
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
       childAssignment: this.json.assignments
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
        let a1= a.due.split("/");
        temp= a1[0];
        a1[0]= a1[2];
        a1[2]= temp;
        //a1= a1[2] + "," + a1[1] + "," + a1[0];
        let d1= new Date(a1);
        let b1= b.due.split("/");
        //b1= b1[2] + "," + b1[1] + "," + b1[0];
        temp= b1[0];
        b1[0]= b1[2];
        b1[2]= temp;
        let d2= new Date(b1);

        return (d1.getTime() - d2.getTime())
        //return (a.getTime() - b.getTime()) for db data

      });
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
    else{
      output= <h3 style= {{color: "red"}}>You currently have no pending assignments!!!!</h3>
    }
    
    
    return (
      <div style= {{width: "80%", margin: "0 auto"}}>
        <h2>Assignments</h2>
        <br /><br />
       { output }
    </div>
    )
  }
}

export default Assignment;
