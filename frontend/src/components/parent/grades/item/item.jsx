import React, { Component } from 'react';
import './item.sass';
import Dropdown from '../../../utils/dropdown';

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