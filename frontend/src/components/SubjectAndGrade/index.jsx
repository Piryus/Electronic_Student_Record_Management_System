import React, { Component } from 'react';
import './style.sass';
import Dropdown from '../Dropdown';

class SubjectAndGrade extends Component {

   render() {
    
    return (
      <div className= "sgContainer">
        <div className= "sgSubject">{this.props.subject}</div>
        <div className= "sgGrade">{this.props.grade}</div>
        <Dropdown detail={[this.props.details]} />
      </div>
    )
  }
}

export default SubjectAndGrade;
