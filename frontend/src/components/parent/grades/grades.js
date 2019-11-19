import React from 'react';
import Dropdown from '../../utils/dropdown';
import SubjectAndGrade from './item/item';
import Title from './title/title';
import styles from './styles.module.css';


class Grades extends React.Component{

  grades = {'JD1' : [
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

  ],
  "WW1" : [
    {
      subject: "Math",
      grade: "10",
      details: "29/10/2019 9.0, 23/09/2019 8.0, 09/08/2019 9.0, 02/10/2019 7.0",
    }
  ]
}

  constructor(props){
    super(props);
    this.state = {
      id: this.props.childId
    };

  }

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

    render(){
        return (
            <div className={styles.gradesPage}>
                <h1>Grades page</h1>
                <Title /> { /*SubjectAndGrade and props to be craeted and filled dynamically from a json file */ }
        { this.grades[this.state.id].map(this.renderItem) }
        {  //table version yet to be styled 
        /*<table>
          <tr>
            <th>Subject</th>
            <th>Grade</th>
            <th></th>
          </tr>
          { this.grades.map(this.renderTableItem) }
        </table>*/ }
            </div>
        );
    }
}

export default Grades;