import React, { Component } from 'react';
import './style.sass';

class TeacherLectureSummary extends Component {

  state = { 
    summary: "",
    edit: false,
    modifySubject: "",
    modifyDate: "",
    modifyClass: "",
    modifySummary: "",
  };

  lectureInfo = [
    {
      subject: "Chemistry",
      date: "09/24/2019",
      class: "5B",
      summary: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum" ,       
    },
    {
      subject: "Physics",
      date: "10/27/2019",
      class: "1A",
      summary: "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like).",
    },
    {
      subject: "Geography",
      date: "11/04/2019",
      class: "3C",
      summary: "There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable. If you are going to use a passage of Lorem Ipsum, you need to be sure there isn't anything embarrassing hidden in the middle of text. All the Lorem Ipsum generators on the Internet tend to repeat predefined chunks as necessary, making this the first true generator on the Internet. It uses a dictionary of over 200 Latin words, combined with a handful of model sentence structures, to generate Lorem Ipsum which looks reasonable. The generated Lorem Ipsum is therefore always free from repetition, injected humour, or non-characteristic words etc.",
    },

  ];

  renderTableItem = (item, index) => {
    return (
      <tr>
        <td>{item.subject}</td>
        <td>{item.date}</td>
        <td>{item.class}</td>
        <td><span style= {{ backgroundColor: "#e0ebeb" , padding: "0px 8px" }} onClick = { () => this.setState({ summary: item.summary, edit: false }) }>details</span><span style= {{margin: "0px 10px", color: "blue"}} onClick= { (event ) => this.validateEdit(event, item.subject, item.date, item.class, item.summary) } >edit</span></td>
      </tr>
    );
  }
  checkEdit = () => {
    if(this.state.edit){
      return(
        <div className = "summary" >
          <form action= "" onSubmit= { values => this.validateData(values) }>
            <textarea style= {{width: "90%"}} rows= "30" onChange= { (event) => this.setState({...this.state, modifySummary: event.target.value}) }>{ this.state.summary }</textarea>
            <input type="submit" value= "modify"/>
          </form>
        </div>
      )
    }
    else{
      return(
        <div className = "summary" >{ this.state.summary }</div>
      )
    }
  }

  validateEdit = (event, sub, dat, cla, sum) => {
    var d= new Date();
    var d2= new Date(dat);
    var lastSunday= new Date(d.toString());

    
    lastSunday= new Date(lastSunday.getTime() - d.getDay() * 24 * 60 * 60 * 1000);
    if(d2 < lastSunday){
      alert("It is too late to modify record for the selected date");
      return;
    }
    this.setState({ summary: sum, edit: true, modifySubject: sub, modifyDate: dat, modifyClass: cla })
  }

  validateData = (event) => {
   //send state variables modifySummary, modifySubject, modifyDate and modifyClass to modify lecture summary
    event.preventDefault();
  }

   render() {
    
    return (
      <div onDoubleClick = { () => this.setState({ summary: "", edit: false }) }> 
        <table style={{width: "80%" }}>
          <tr>
            <th>Subject</th>
            <th>Date</th>
            <th>Class</th>
            <th>Summary</th>
          </tr>
          { this.lectureInfo.map(this.renderTableItem) }
        </table>
        { this.checkEdit() } 
      </div>
    )
  }
}

export default TeacherLectureSummary;
