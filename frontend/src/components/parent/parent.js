import React from 'react';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link
  } from "react-router-dom";
import Grades from './components/grades';
import Login from '../components/Login/index';
import styles from './styles.module.css';

class Parent extends React.Component{


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
                
                {this.state.loggingIn === true && (<div>
                    <div className={styles.header}>
                        <h1>Parent section</h1>
                    </div>
                    <Router>
                        <div>
                            <table className={styles.panel}>
                                <tr>
                                    <td>
                                        <Link className={styles.link} to="/components/grades.js">
                                            <div className={styles.panelElement}>
                                                <p>Grades</p>
                                            </div>
                                        </Link >
                                    </td>
                                </tr>
                                <tr>
                                </tr>
                            </table>

                            <Switch>
                                <Route path="/components/grades.js" render={(props) => <Grades {...props} />} />
                            </Switch>

                       </div>
                    </Router>
                    
                </div>
                )}   
            </div>
        );
    }
}

export default Parent;