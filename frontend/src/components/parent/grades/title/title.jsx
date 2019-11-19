import React, { Component } from 'react';
import '../item/item.sass';

class Title extends Component {

   render() {
    
    return (
      <div className= "titleContainer">
        <div className= "subjectGrade">Subject</div>
        <div className= "subjectGrade">Grade</div>
      </div>
    )
  }
}

export default Title;