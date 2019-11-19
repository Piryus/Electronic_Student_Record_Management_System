import React, { Component } from 'react';
import DailyLecture from '../daily-lecture/teacher-daily-lecture';
import './teacher-lecture-summary.sass';

class TeacherLectureSummary extends Component {

  constructor(props){
    super(props);
    this.state = { 
      summary: "",
      showMore: false,
      edit: false,
      addTopicRequest: false,
      modifySubject: "",
      modifyDate: "",
      modifyClass: "",
      modifySummary: "",
      lectureInfo: [
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
    
      ]
    };
    this.cancelAddTopic = this.cancelAddTopic.bind(this);
    this.addLectureToSummary = this.addLectureToSummary.bind(this);
  }

  addLectureToSummary(subject, date, clas, resume){
    alert(subject + date + clas + resume);
    this.setState({addTopicRequest: false, lectureInfo: this.state.lectureInfo.concat({
      subject: subject,
      date: date,
      class: clas,
      summary: resume
    })});
  }

  renderTableItem = (item, index) => {
    return (
      <tr>
        <td className= "columnItem">{item.subject}</td>
        <td className= "columnItem">{item.date}</td>
        <td className= "columnItemClass">{item.class}</td>
        <td><span className= "moreButton" onClick = { () => this.setState({ summary: item.summary, edit: false, showMore: true }) }>More</span><span className="editButton" onClick= { (event ) => this.validateEdit(event, item.subject, item.date, item.class, item.summary) } >Edit</span></td>
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

  cancelAddTopic(){
    this.setState({addTopicRequest: false, showMore: false});
  }

   render() {
    
    return (
      <div onDoubleClick = { () => this.setState({ summary: "", edit: false }) }> 
        <table className="summaryTable">
          <tr>
            <th className="columnName">Subject</th>
            <th className="columnName">Date</th>
            <th className="columnName">Class</th>
            <th className="columnName">Summary</th>
          </tr>
          {this.state.lectureInfo.map(this.renderTableItem) }
          <span className="addTopicButton" onClick={() => this.setState({showMore: false, addTopicRequest: true}) }>Add Topic</span>
        </table>
        { this.state.showMore === true && this.state.addTopicRequest === false && this.checkEdit()}
        { this.state.addTopicRequest === true && (
          <DailyLecture cancelAddTopic = {this.cancelAddTopic} addLecture = {this.addLectureToSummary}/>
        )} 
      </div>
    )
  }
}

export default TeacherLectureSummary;
