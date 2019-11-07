import React, { Component } from 'react';
import './style.sass';

class EnrolmentForm extends Component {

  state = { 
    studentClass: "",
  };

  validateData = (event) => {
    var tmp= this.state.studentClass;
    var tmp2= tmp.split("");


    if(isNaN(tmp2[0]) || !isNaN(tmp2[1]) || tmp2[0] > 5 || tmp2[0] < 1){
      alert("The class is not vaild");
    }
  
    event.preventDefault();
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
              <td><input type= "text" name= "name" className= "efName" required /></td>
            </tr>
            <tr>
              <td>Surname <span style={{color: "red"}}>*</span></td>
              <td><input type= "text" name="surname" className= "efSurname" required /></td>
            </tr>
            <tr>
              <td>Fiscal Code <span style={{color: "red"}}>*</span></td>
              <td><input type= "text" name="fiscalCode" className= "efFiscalCode" maxlength= "16" required /></td>
            </tr>
            <tr>
              <td>Class <span style={{color: "red"}}>*</span></td>
              <td><input type= "text" name="studentClass" className= "efclass" maxlength= "2" required onChange= { (event) => this.setState({studentClass: event.target.value})} /></td>
            </tr>
            <tr>
              <td>Father (Fiscal code) <span style={{color: "red"}}>*</span></td>
              <td><input type= "text" name="fatherFiscalCode" className= "efFiscalCode" maxlength= "16" required /></td>
            </tr>
            <tr>
              <td>Mother(Fiscal Code) <span style={{color: "red"}}>*</span></td>
              <td><input type= "text" name="motherFiscalCode" className= "efFiscalCode" maxlength= "16" required /></td>
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
