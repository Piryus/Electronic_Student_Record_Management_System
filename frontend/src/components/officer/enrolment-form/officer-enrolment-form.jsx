import React, { Component } from 'react';
import './officer-enrolment-form.sass';

class EnrolmentForm extends Component {

  state = { 
    studentClass: "",
    fiscalCode: "",
    mfiscalCode: "",
    ffiscalCode: "",
    name: "",
    surname: "",
  };

  validateData = (event) => {
    var tmp= this.state.studentClass;
    var tmp2= tmp.split("");


    if(isNaN(tmp2[0]) || !isNaN(tmp2[1]) || tmp2[0] > 5 || tmp2[0] < 1){
      alert("The class is not vaild");
    }
  
    event.preventDefault();
  }
  setUpper = (event) => {
    var tmp= event.target.value;
    var tmp2= event.target.name;
    tmp= tmp.toUpperCase();
    if(tmp2 == "studentClass"){
      this.setState( { studentClass: tmp } )
    }
    if(tmp2 == "fiscalCode"){
      this.setState( { fiscalCode: tmp } )
    }
    if(tmp2 == "fatherFiscalCode"){
      this.setState( { ffiscalCode: tmp } )
    }
    if(tmp2 == "motherFiscalCode"){
      this.setState( { mfiscalCode: tmp } )
    }
    if(tmp2 == "name"){
      this.setState( { name: tmp } )
    }
    if(tmp2 == "surname"){
      this.setState( { surname: tmp } )
    }
  }

   render() {
    
    return (
      <div>
        <h3>Student online enrolment</h3>
        <div style= {{width: "50%", margin: "auto", backgroundColor: "grey", align: "center"}}>
        <form action= "" style= {{textAlign: "left"}} onSubmit= { values => this.validateData(values) }>
          <table style={{width: "100%"}}>
            <tr>
              <td>Name <span style={{color: "red"}}>*</span></td>
              <td><input type= "text" name= "name" value= {this.state.name} className= "efName" required onChange= { (event) => this.setUpper(event) } /></td>
            </tr>
            <tr>
              <td>Surname <span style={{color: "red"}}>*</span></td>
              <td><input type= "text" name="surname" value= {this.state.surname} className= "efSurname" required onChange= { (event) => this.setUpper(event) } /></td>
            </tr>
            <tr>
              <td>Fiscal Code <span style={{color: "red"}}>*</span></td>
              <td><input type= "text" name="fiscalCode" value= {this.state.fiscalCode} className= "efFiscalCode" maxlength= "16" required onChange= { (event) => this.setUpper(event) } /></td>
            </tr>
            <tr>
              <td>Class <span style={{color: "red"}}>*</span></td>
              <td><input type= "text" name="studentClass" className= "efclass" value= {this.state.studentClass} maxlength= "2" required onChange= { (event) => this.setUpper(event) } /></td>
            </tr>
            <tr>
              <td>Father (Fiscal code) <span style={{color: "red"}}>*</span></td>
              <td><input type= "text" name="fatherFiscalCode" value= {this.state.ffiscalCode} className= "efFiscalCode" maxlength= "16" required onChange= { (event) => this.setUpper(event) } /></td>
            </tr>
            <tr>
              <td>Mother(Fiscal Code) <span style={{color: "red"}}>*</span></td>
              <td><input type= "text" name="motherFiscalCode" value= {this.state.mfiscalCode} className= "efFiscalCode" maxlength= "16" required onChange= { (event) => this.setUpper(event) } /></td>
            </tr>
          </table>
        
          <br/><br/>
          <input type="submit" value= "Send" style= {{width: "150px", margin: "0px 40%", align: "center"}}/>
        </form>
        </div>
      </div>
    )
  }
}

export default EnrolmentForm;
