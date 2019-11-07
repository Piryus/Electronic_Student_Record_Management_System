import React from 'react';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link
  } from "react-router-dom";
import Grades from './components/grades';
import Demo from './components/demo';
import SubjectsAndGrades from '../components/SubjectsAndGrades/index';

class Parent extends React.Component{
    render(){
        return (
            <div>
                <div className="header">
                    <h1>Parent section</h1>
                </div>
                <div className="panel">
                    <Router>
                        <div>
                            <table>
                                <tr>
                                    <td>
                                        <Link to="/components/grades.js">
                                            <div className="panelElement">
                                                <p>Grades</p>
                                            </div>
                                        </Link>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <Link to="/components/demo.js">
                                            <div className="panelElement">
                                                <p>Demo</p>
                                            </div>
                                        </Link>
                                    </td>
                                </tr>
                            </table>

                            <Switch>
                                <Route path="/components/grades.js" render={(props) => <Grades {...props} />} />
                            </Switch>
                            <Switch>
                                <Route path="/components/demo.js" render={(props) => <Demo {...props} />} />
                            </Switch>

                       </div>
                    </Router>
                </div>
            </div>
        );
    }
}

export default Parent;