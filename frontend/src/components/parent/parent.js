import React from 'react';
import Grades from './grades/grades';
import styles from './styles.module.css';

export default class Parent extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            userRequest: '',
            childSelected: 'JD1',
            children: props.children,
        };
        this.setUserRequest = this.setUserRequest.bind(this);
    }

    renderChildItem = (item, index) => {
        return (
            <option value={item.id}>{item.surname + ' ' + item.name}</option>
        );
    }

    selectChild = (e) => {
        this.setState({
            childSelected: e.target.value,
            userRequest: ''
        });
    }

    setUserRequest(e, choice) {
        this.setState({userRequest: choice});
    }

    render() {
        return (
            <div className={styles.body}>
                <div>
                    <div className={styles.header}>
                        <h1>Parent section</h1>
                    </div>

                    <div className={styles.selectorWrapper}>
                        <select className={styles.childSelector} onChange={(e) => this.selectChild(e)}>
                            {this.state.children.map(this.renderChildItem)}
                        </select>
                    </div>

                    <div>
                        <table className={styles.panel}>
                            <tr>
                                <td>
                                    <button onClick={(e) => this.setUserRequest(e, "grades")} className={styles.link}>
                                        <div className={styles.panelElement}>
                                            <p>Grades</p>
                                        </div>
                                    </button>
                                </td>
                            </tr>
                            <tr>
                            </tr>
                        </table>

                        {this.state.userRequest === 'grades' && (
                            <Grades childId={this.state.childSelected}/>
                        )}
                    </div>
                </div>
            </div>
        );
    }
}