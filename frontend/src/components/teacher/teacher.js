import React from 'react';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link
  } from "react-router-dom";
import Login from '../components/Login/index';
import DailyLecture from './components/index';
import styles from './styles.module.css';

class Teacher extends React.Component{


    constructor(props){
        super(props);
        this.state = {
            loggingIn: false
        };

    }

    handleLogin = (val) => {
        this.setState({loggingIn: val})
    }

    render(){
        return (
            <div className={styles.body}>
                {this.state.loggingIn === false && (
                  <Login handleLogin = {this.handleLogin} />
                )}
                
                {this.state.loggingIn === true && (
                <div>
                    <div className={styles.header}>
                        <h1>Teacher section</h1>
                    </div>
                    <Router>
                        <div>
                            <table className={styles.panel}>
                                <tr>
                                    <td>
                                        <Link className={styles.link} to="/components/index.jsx">
                                            <div className={styles.panelElement}>
                                                <p>Daily lecture</p>
                                            </div>
                                        </Link >
                                    </td>
                                </tr>
                                <tr>
                                </tr>
                            </table>

                            <Switch>
                                <Route path="/components/index.jsx" render={(props) => <DailyLecture {...props} />} />
                            </Switch>

                       </div>
                    </Router>
                    
                </div>
                )}   
            </div>
        );
    }
}

export default Teacher;