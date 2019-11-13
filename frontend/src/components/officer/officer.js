import React from 'react';
import ParentAccountEnabling from './parent-access/officer-parent-access';
import styles from './styles.module.css';

export default class Officer extends React.Component {


    constructor(props) {
        super(props);
        this.state = {
            userRequest: ''
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
                        <h1>Officer section</h1>
                    </div>

                    <div>
                        <table className={styles.panel}>
                            <tr>
                                <td>
                                    <button onClick={(e) => this.setUserRequest(e, "accounts")} className={styles.link}>
                                        <div className={styles.panelElement}>
                                            <p>Parents Accounts</p>
                                        </div>
                                    </button>
                                </td>
                            </tr>
                            <tr>
                            </tr>
                        </table>

                        {this.state.userRequest === 'accounts' && (
                            <ParentAccountEnabling/>
                        )}
                    </div>
                </div>
            </div>
        );
    }
}