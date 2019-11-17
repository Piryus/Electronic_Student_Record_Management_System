import React, { Component } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import './style.sass';

import Timetable from '../../utils/timetable';

class LectureTopics extends Component {

  render() {
    return (
      <div>
        <h2>Lecture Topics</h2>
        <div className="container">
          <Timetable data={this.props.timetable} />
          <span className="topics-label">Topics</span>
          <Form.Control as="textarea" rows="5" disabled />
          <Button className="submit-button" disabled={true} type="submit">Save changes</Button>
        </div>
      </div>
    )
  }
}

export default LectureTopics;