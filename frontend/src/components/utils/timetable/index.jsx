import React, { Component } from 'react';
import styles from './style.css';

const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

class Timetable extends Component {

  render() {
    const timetable = this.props.data || {};
    return (
      <div className="schedule">
        <div className="schedule-timeline">
          <ul>
            <li><span>08:00</span></li>
            <li><span>09:00</span></li>
            <li><span>10:00</span></li>
            <li><span>11:00</span></li>
            <li><span>12:00</span></li>
            <li><span>13:00</span></li>
          </ul>
        </div>
        <div className="schedule-events">
          <ul>
            {[...Array(5).keys()].map(i => (
              <li className="schedule-group" key={i}>
                <div className="schedule-top-info"><span>{days[i]}</span></div>
                <ul>
                  {[...Array(6).keys()].map(j => {
                    const key = i + '_' + j;
                    const entry = timetable[key];
                    return entry ? (
                      <li className="schedule-event" key={key}>
                        <a>
                          <span className="schedule-name">{entry}</span>
                        </a>
                      </li>
                    ) : (
                      <li className="schedule-emptyevent" key={key}>
                      </li>
                    )
                  })}
                </ul>
              </li>
            ))}
          </ul>
        </div>
      </div>
    )
  }
}

export default Timetable;