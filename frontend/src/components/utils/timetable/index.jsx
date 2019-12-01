import '@emarkk/hlib';
import React, { Component } from 'react';
import styles from './style.css';


const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

class Timetable extends Component {

  render() {
    const now = new Date(Date.now());
    const ws = now.weekStart();
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
                <div className="schedule-top-info"><span>{days[i]}</span><span className="schedule-date">{ws.addDays(i).shortString()}</span></div>
                <ul>
                  {[...Array(6).keys()].map(j => {
                    const key = i + '_' + j;
                    const entry = timetable[key];
                    let classes = ['schedule-event'];
                    
                    if(this.props.selectable)
                      classes.push('schedule-event' + (this.props.selected === key ? '' : '-not') + '-selected');
                    if(entry && !entry.active)
                      classes.push('schedule-event-disabled');

                    return entry ? (
                      <li className={classes.join(' ')} key={key}>
                        <a onClick={() => {entry.active && this.props.onClick(key)}}>
                          <span className="schedule-name">{entry.name}</span>
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