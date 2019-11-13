import React from 'react';
import styles from './styles.module.css';
import TeacherLectureSummary from './lecture-summary/teacher-lecture-summary';

export default class Parent extends React.Component {


    constructor(props) {
        super(props);
        this.state = {
            userRequest: '',
        };
        this.setUserRequest = this.setUserRequest.bind(this);
    }


    setUserRequest(e, choice) {
        this.setState({userRequest: choice});
    }


    render() {
        return (
            <div className={styles.body}>
                <div>
                    <div className={styles.header}>
                        <h1>Teacher section</h1>
                    </div>

                    <div className={styles.selectorWrapper}>

                    </div>

                    <div>
                        <table className={styles.panel}>
                            <tr>
                                <td>
                                    <button onClick={(e) => this.setUserRequest(e, "lectures")} className={styles.link}>
                                        <div className={styles.panelElement}>
                                            <p>Lectures</p>
                                        </div>
                                    </button>
                                </td>
                            </tr>
                            <tr>
                            </tr>
                        </table>

                        {this.state.userRequest === 'lectures' && (
                            <TeacherLectureSummary/>
                        )}
                    </div>
                </div>
            </div>
        );
    }
}