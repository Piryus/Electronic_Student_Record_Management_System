import React from 'react';
import {BrowserRouter as Router, Switch, Route, Redirect} from "react-router-dom";
import Login from '../login';
import Parent from '../parent/parent';
import Teacher from '../teacher/teacher';
import Officer from '../officer/officer';

class App extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            authenticated: false,
            role: 'officer', /*to be made dynamic using props because it is inherited from login component*/
        }
    }

    render() {
        return (
            <Router>
                <Switch>
                    {!this.state.authenticated && (
                        <div>
                            <Route exact path='/login'>
                                <Login loggingIn={this.state.loggingIn}/>
                            </Route>
                            <Redirect to='/login'/>
                        </div>
                    )}
                    {this.state.authenticated && this.state.role === 'parent' && (
                        <div>
                            <Route exact path='/parent'>
                                <Parent loggingIn={this.state.loggingIn}/>
                            </Route>
                            <Redirect to='/parent'/>
                        </div>
                    )}
                    {this.state.authenticated && this.state.role === 'teacher' && (
                        <div>
                            <Route exact path='/teacher'>
                                <Teacher loggingIn={this.state.loggingIn}/>
                            </Route>
                            <Redirect to='/teacher'/>
                        </div>
                    )}
                    {this.state.authenticated && this.state.role === 'officer' && (
                        <div>
                            <Route exact path='/officer'>
                                <Officer loggingIn={this.state.loggingIn}/>
                            </Route>
                            <Redirect to='/officer'/>
                        </div>
                    )}
                </Switch>
            </Router>
        );
    }
}

export default App;