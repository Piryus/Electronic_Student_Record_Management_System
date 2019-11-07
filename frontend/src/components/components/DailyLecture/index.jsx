import React, { Component } from 'react';
import './style.sass';

class DailyLecture extends Component {

  state = { 
    date: "",
    subject: "",
    summary: "",
  };

  validateData = (event) => {
    var d= new Date();
    var d2= new Date(this.state.date);
    var lastSunday= new Date(d.toString());
    var error= "";
    
    lastSunday= new Date(lastSunday.getTime() - d.getDay() * 24 * 60 * 60 * 1000);
    
    if(this.state.date === ""){
      error += "You must fill the Lecture date \n" ;
    }
    if(this.state.subject === ""){
      error += "You must fill the Subject \n";
    }
    if(this.state.summary === ""){
      error += "You must fill the Lecture summary \n";
    }
    if(this.state.date === "" || this.state.subject === "" || this.state.summary === ""){
      alert(error);
    }

    if(d2 > d){
      alert("You cannot record a future date");
      event.preventDefault(); 
      return; 
    }
    if(d2 < lastSunday){
      alert("It is too late to insert record for the selected");
      event.preventDefault(); 
      return;
    }

    event.preventDefault();
  }

   render() {
    
    return (
      <div>
        <form action= "" onSubmit= { values => this.validateData(values) }>
         Date: <input type= "date" name= "date" className= "dlDate" onChange= { (event) => this.setState({date: event.target.value})} /> <br/>
         Subject: <input type= "text" name="subject" className= "dlSubject" onChange= { (event) => this.setState({subject: event.target.value})} /><br/><br/>
          <textarea rows= "4" cols="50" placeholder= "Fill lecture summary here" onChange= { (event) => this.setState({summary: event.target.value})} ></textarea><br/><br/>
          <input type="submit" value= "Send"/>
        </form>
      </div>
    )
  }
}

export default DailyLecture;
