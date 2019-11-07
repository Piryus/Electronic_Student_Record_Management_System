import React, { Component } from 'react';
import SubjectAndGrade from '../SubjectAndGrade/index';
import Title from '../SubjectAndGrade/Title';
import Dropdown from '../Dropdown/index';

class SubjectsAndGrades extends Component {

  grades = [
    {
      subject: "Math",
      grade: "10",
      details: "29/10/2019 9.0, 23/09/2019 8.0, 09/08/2019 9.0, 02/10/2019 7.0",
    },
    {
      subject: "Physics",
      grade: "9",
      details: "27/10/2019 6.0, 28/09/2019 8.5, 11/08/2019 9.0, 22/10/2019 7.0",
    },
    {
      subject: "Chemistry",
      grade: "8",
      details: "23/10/2019 9.0, 19/09/2019 8.0, 05/08/2019 9.0, 18/10/2019 7.0",
    },

  ];

  renderItem = (item, index) => {
    return (
      <SubjectAndGrade subject= {item.subject} grade= {item.grade}  details= {item.details} />
    );
  }
  renderTableItem = (item, index) => {
    return (
      <tr>
        <td>{item.subject}</td>
        <td>{item.grade}</td>
        <td><Dropdown detail={[item.details]} /></td>
      </tr>
    );
  }

   render() {
    
    return (
      <div>
        <Title /> { /*SubjectAndGrade and props to be craeted and filled dynamically from a json file */ }
        { this.grades.map(this.renderItem) }
        {  //table version yet to be styled 
        <table>
          <tr>
            <th>Subject</th>
            <th>Grade</th>
            <th></th>
          </tr>
          { this.grades.map(this.renderTableItem) }
        </table> }
      </div>
    )
  }
}

export default SubjectsAndGrades;
