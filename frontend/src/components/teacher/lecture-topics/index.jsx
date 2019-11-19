import React, { Component } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import './style.sass';

import Timetable from '../../utils/timetable';

class LectureTopics extends Component {

  state = {
    busy: false,
    selectedWeekhour: null,
    topicsString: '',
    newTopicsString: ''
  };

  async hourSelected(wh) {
    if(!this.state.busy) {
      this.setState({
        busy: true,
        selectedWeekhour: wh
      });
      const url = 'http://localhost:3000/lectures/' + wh;
      const options = {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        credentials: 'include'
      };
      const rawResponse = await fetch(url, options);
      const response = await rawResponse.json();
      this.setState({
        busy: false,
        topicsString: response.topics || '',
        newTopicsString: response.topics || ''
      });
    }
  }

  async saveChanges() {
    if(!this.state.busy) {
      this.setState({
        busy: true
      });
      const url = 'http://localhost:3000/lectures';
      const options = {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          weekhour: this.state.selectedWeekhour,
          topics: this.state.newTopicsString
        })
      };
      const rawResponse = await fetch(url, options);
      const response = await rawResponse.json();
      this.setState({
        busy: false,
        topicsString: this.state.newTopicsString
      });
    }
  }

  render() {
    return (
      <div>
        <h2>Lecture Topics</h2>
        <div className="container">
          <Timetable selectable data={this.props.timetable} selected={this.state.selectedWeekhour} onClick={(wh) => this.hourSelected(wh)} />
          <span className="topics-label">Topics</span>
          <Form.Control as="textarea" rows="5" onChange={(e) => this.setState({ newTopicsString: e.target.value})} disabled={this.state.selectedWeekhour === null} value={this.state.newTopicsString || ''} />
          <Button className="submit-button" onClick={() => this.saveChanges()} disabled={this.state.selectedWeekhour === null || (this.state.topicsString === this.state.newTopicsString)} type="submit">Save changes</Button>
        </div>
      </div>
    )
  }
}

export default LectureTopics;