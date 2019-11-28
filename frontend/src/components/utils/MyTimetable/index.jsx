import React, { Component } from 'react';
import styles from './style.sass';

const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
const tmp= [
  {
    date: "25/11/2019",
    content: [
      {
        text: "History",
        color: "red"
      },
      {
        text: "Maths",
        color: "blue"
      },
      {
        text: "Italian",
        color: "green"
      },
      {
        text: "Geograhy",
        color: "black"
      },
      {
        text: "Literature",
        color: "brown"
      },
      {
        text: "Languages",
        color: "red"
      },
    ]
  },
  {
    date: "26/11/2019",
    content: [
      {
        text: "History",
        color: "red"
      },
      {
        text: "History",
        color: "red"
      },
      {
        text: "History",
        color: "red"
      },
      {
        text: "History",
        color: "red"
      },
      {
        text: "History",
        color: "red"
      },
      {
        text: "History",
        color: "red"
      },
    ]
  },
  {
    date: "26/11/2019",
    content: [
      {
        text: "History",
        color: "red"
      },
      {
        text: "History",
        color: "red"
      },
      {
        text: "History",
        color: "red"
      },
      {
        text: "History",
        color: "red"
      },
      {
        text: "History",
        color: "red"
      },
      {
        text: "History",
        color: "red"
      },
    ]
  },
  {
    date: "28/11/2019",
    content: [
      {
        text: "History",
        color: "red"
      },
      {
        text: "History",
        color: "red"
      },
      {
        text: "History",
        color: "red"
      },
      {
        text: "History",
        color: "red"
      },
      {
        text: "History",
        color: "red"
      },
      {
        text: "History",
        color: "red"
      },
    ] 
  },
  {
    date: "29/11/2019",
    content: [
      {
        text: "History",
        color: "red"
      },
      {
        text: "History",
        color: "red"
      },
      {
        text: "History",
        color: "red"
      },
      {
        text: "History",
        color: "red"
      },
      {
        text: "History",
        color: "red"
      },
      {
        text: "History",
        color: "red"
      },
    ]
    
  }
];
   
class MyTimetable extends Component {

  render() {
    const timetable = this.props.data || tmp;
    return (
     
        <div style= {{width: "80%", margin: "0 auto"}} className= "timeTable">
          <div>
          <div style= {{border: "none"}} className= "tableCell">
          </div>
          <div className= "tableCell"><span>08:00</span>
          </div>
          <div className= "tableCell"><span>09:00</span>
          </div>
          <div className= "tableCell"><span>10:00</span>
          </div>
          <div className= "tableCell"><span>11:00</span>
          </div>
          <div className= "tableCell"><span>12:00</span>
          </div>
          <div className= "tableCell"><span>13:00</span>
          </div>
          </div>
          {timetable.map(({date, content}, index) => {
            return(
              <div className= "innerTable">
              <div className= "tableCell">{days[index]} <br/>{date}
              </div>
              <div>
                {content.map(({text, color}, i) => {
                      return (
                        <div style= {{backgroundColor: color, borderStyle: "ridge", color: "white"}} className= "tableCell">{text}
                        </div>
                      )      
                })}
              </div>
              </div>
            )
            })}
        </div>
    )
  }
}

export default MyTimetable;