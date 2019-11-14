import React, { Component } from 'react';
import './teacher-daily-lecture.sass';

class DailyLecture extends Component {

  constructor(props){
    super(props);
    this.state = { 
      date: "",
      subject: "",
      summary: "",
      classYear: "",
      classSection: "",
    };
  }

  

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
    if(this.state.classYear === "" || this.state.classSection === ""){
      error += "You must fill the both Class year and Class section \n";
    }
    if(this.state.summary === ""){
      error += "You must fill the Lecture summary \n";
    }
    if(this.state.date === "" || this.state.subject === "" || this.state.summary === "" || this.state.classYear === "" || this.state.classSection === ""){
      alert(error);
    }
    else{
      if(isNaN(this.state.classYear)){
        alert('Pleas insert a correct year');
      }
      else{
        if(this.state.classYear <= 0){
          alert('Pleas insert a correct year');
        }
        else{
          if(this.state.classSection.length > 1){
            alert('Pleas insert a correct class letter');
          }
          else{
            var letters = /^[a-zA-Z]+$/;
            if(!this.state.classSection.match(letters)){
              alert('Pleas insert a correct class letter');
            }
            else{
              if(d2 > d){ //DEBUG: set condition to false to bypass it
                alert("You cannot record a future date");
                event.preventDefault(); 
                return; 
              }
              else{
                if(d2 < lastSunday){
                  alert("It is too late to insert record for the selected");
                  event.preventDefault(); 
                  return;
                }
                else{
                  //END of validation. Update the interface, store data in db here
                  //Update state and interface
                  this.props.addLecture(this.state.subject, this.state.date, this.state.classYear+this.state.classSection, this.state.summary);
                }
              }
            }
          }
        }
      }
  }
    event.preventDefault();
  }

   render() {
    return (
      <div className="mainContainer">
        <form className="form" action= "" onSubmit= { values => this.validateData(values) }>
         Date: <input type= "date" name= "date" className= "dlDate" onChange= { (event) => this.setState({date: event.target.value})} /> <br/>
         Subject: <input type= "text" name="subject" className= "dlSubject" onChange= { (event) => this.setState({subject: event.target.value})} /><br/><br/>
         Class Year: <input type="text" name="class" className= "dlClassYear" onChange={ (event) => this.setState({classYear: event.target.value})}></input>
         Class Section: <input type="text" name="class" className= "dlClassSection" onChange={ (event) => this.setState({classSection: event.target.value})}></input>
          <textarea rows= "4" cols="50" className="formTextArea" placeholder= "Fill lecture summary here" onChange= { (event) => this.setState({summary: event.target.value})} ></textarea><br/><br/>
          <input type="submit" value= "Send" className="submitButton"/>
          <input type="reset" value="Cancel" className="cancelButton" onClick={() => this.props.cancelAddTopic()}/>
        </form>
      </div>
    );
  }
}

export default DailyLecture;
