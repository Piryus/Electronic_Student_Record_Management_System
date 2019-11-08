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
            loggingIn: false,
            showingGrades: false,
            childSelected: 'JD1',
            child: [
                {
                    name: 'John',
                    surname: 'Doe',
                    id: 'JD1'
                },
                {
                    name: 'Walter',
                    surname: 'White',
                    id: 'WW1'
                }
            ]
        };
        this.handleLogin = this.handleLogin.bind(this);
    }

    renderChildItem = (item, index) => {
        return(
        <option value={item.id} >{item.surname + ' ' + item.name}</option>
        );
    }

    selectChild = (e) => {
        this.setState({
            showingGrades: false,
            childSelected: e.target.value,
        });
    }

    setShowGrades = (val) => {
        this.setState({showingGrades: true});
    }

    handleLogin(username, password) {
        const url = 'http://localhost:3000/login';
        const options = {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                mail: username,
                password: password
            })
        };
        fetch(url, options)
            .then(response => response.json())
            .then(response => {
                if (response.success === true) {
                    this.setState({loggingIn: true});
                } else {
                    // Connection rejected handler
                    console.log(response);
                }
            })
            .catch(error => {
                console.log(error)
            });
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

                    <div className={styles.selectorWrapper}>
                        <select className={styles.childSelector} onChange={(e) => this.selectChild(e)}>
                            {this.state.child.map(this.renderChildItem)}
                        </select>
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
                                <Route path="/components/grades.js" render={(props) => <Grades {...props} childId = {this.state.childSelected} showGrades = {this.setShowGrades} />} />
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