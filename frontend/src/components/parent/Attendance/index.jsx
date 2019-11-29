import React, { Component } from 'react';


import MyTimetable from '../../utils/MyTimetable';

const absent= "Absent";
const empty= "";
const earlyExit= "Early Exit";
const lateEntrance= "Late Entrance";
const lateAndEarly= <span>Late Entry <br/> Early Exit</span>;
var tmp2= ["a", "b", "c", "d", "e", "f",];
var tmp3= [
  {
    date: "",
    content: [
      {
        text: "",
        color: ""
      },
      {
        text: "",
        color: ""
      },
      {
        text: "",
        color: ""
      },
      {
        text: "",
        color: ""
      },
      {
        text: "",
        color: ""
      },
      {
        text: "",
        color: ""
      },
    ]
  },
  {
    date: "",
    content: [
      {
        text: "",
        color: ""
      },
      {
        text: "",
        color: ""
      },
      {
        text: "",
        color: ""
      },
      {
        text: "",
        color: ""
      },
      {
        text: "",
        color: ""
      },
      {
        text: "",
        color: ""
      },
    ]
  },
  {
    date: "",
    content: [
      {
        text: "",
        color: ""
      },
      {
        text: "",
        color: ""
      },
      {
        text: "",
        color: ""
      },
      {
        text: "",
        color: ""
      },
      {
        text: "",
        color: ""
      },
      {
        text: "",
        color: ""
      },
    ]
  },
  {
    date: "",
    content: [
      {
        text: "",
        color: ""
      },
      {
        text: "",
        color: ""
      },
      {
        text: "",
        color: ""
      },
      {
        text: "",
        color: ""
      },
      {
        text: "",
        color: ""
      },
      {
        text: "",
        color: ""
      },
    ] 
  },
  {
    date: "",
    content: [
      {
        text: "",
        color: ""
      },
      {
        text: "",
        color: ""
      },
      {
        text: "",
        color: ""
      },
      {
        text: "",
        color: ""
      },
      {
        text: "",
        color: ""
      },
      {
        text: "",
        color: ""
      },
    ]
    
  }
];
const tmp= [
  {
    date: "25/11/2019",
    enter: 1,
    exit: 5,
    event: {
      absent: false,
      lateEntrance: false,
      earlyExit: true,
    }, 
    
  },
  {
    date: "26/11/2019",
    enter: 1,
    exit: 4,
    event: {
      absent: false,
      lateEntrance: false,
      earlyExit: false,
    },
    
  },
  {
    date: "27/11/2019",
    enter: 1,
    exit: 6,
    event: {
      absent: true,
      lateEntrance: false,
      earlyExit: false,
    },
    
  },
  {
    date: "28/11/2019",
    enter: 1,
    exit: 5,
    event: {
      absent: false,
      lateEntrance: true,
      earlyExit: false,
    },
    
  },
  {
    date: "29/11/2019",
    enter: 1,
    exit: 5,
    event: {
      absent: false,
      lateEntrance: false,
      earlyExit: false,
    },
    
  },
];
   
class Attendance extends Component {

  constructor(props) {
    super(props);
    this.state = {
      childAttendance: [],
    }
  }

  startOfWeek = (date) =>
  {
    var diff = date.getDate() - date.getDay() + (date.getDay() === 0 ? -6 : 1);
  
    return new Date(date.setDate(diff));
 
  }//To get first monday of the week for weekly query

  async componentDidMount() {
    await this.getChildAttendance();
  } 
  
  async getChildAttendance() {
    // Query child's attendance
    const url = 'http://localhost:3000/attendance/' + this.props.child._id;
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
       childAttendance: json.attendance
    });
  }

  render() {
    //tmp equals GET data
    //Handle data from backend
    let store= this.state.childAssignment || tmp;
    const now = new Date();
    const sw= this.startOfWeek(now);//for weekly query
    
    return (
      <div style= {{width: "80%", margin: "0 auto"}}>
        <h1 style= {{textAlign: "center"}}>Daily Lectures Attendance</h1>
        <br/><br/> 
          {store.map((item, index) => {
            tmp3[index].date= tmp[index].date;
                {tmp2.map((it, i) => {
                    if(item.event.absent){
                      tmp3[index].content[i].color = "#996633";
                      tmp3[index].content[i].text = absent;
                      }
                      else if(item.event.lateEntrance && i == item.enter - 1){
                        tmp3[index].content[i].color = "#248f24";
                        tmp3[index].content[i].text = lateEntrance; 
                      }
                      else if(item.event.earlyExit && i == item.exit - 1){
                        tmp3[index].content[i].color = "#248f24";
                        tmp3[index].content[i].text = earlyExit; 
                      }
                      else if(i >= item.enter - 1 && i <= item.exit -1){
                        tmp3[index].content[i].color = "#248f24";
                        tmp3[index].content[i].text = empty; 
                      }
                      else{
                        tmp3[index].content[i].color = "#e0ebeb";
                        tmp3[index].content[i].text = empty;
                      }
                })}
            })}
        <MyTimetable data={tmp3} />
      </div>
    )
  }
}

export default Attendance;