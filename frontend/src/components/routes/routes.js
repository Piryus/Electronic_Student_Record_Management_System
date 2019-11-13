import React from 'react';
import {BrowserRouter as Router, Switch, Route, Redirect} from "react-router-dom";
import Login from "../login";
import Parent from "../parent/parent";
import Teacher from "../teacher/teacher";
import Officer from "../officer/officer";
import Admin from '../admin/admin';

export default class Routes extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            authenticated: this.props.appProps.authenticated,
            role: this.props.appProps.role,
            children: this.props.appProps.children,
            setAppProps: this.props.appProps.setAppProps
        };
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.appProps.authenticated !== prevState.authenticated) {
            return {
                authenticated: nextProps.appProps.authenticated,
                role: nextProps.appProps.role,
                children: nextProps.appProps.children
            };
        } else return null;
    }

    render() {
        return (
            <Router>
                <Switch>
                    {!this.state.authenticated && (
                        <div>
                            <Route exact path='/login'>
                                <Login setAppProps={this.state.setAppProps} />
                            </Route>
                            <Redirect to='/login'/>
                        </div>
                    )}
                    {this.state.authenticated && this.state.role.includes('parent') && (
                        <div>
                            <Route exact path='/parent'>
                                <Parent children={this.state.children} />
                            </Route>
                            <Redirect to='/parent'/>
                        </div>
                    )}
                    {this.state.authenticated && this.state.role.includes('teacher') && (
                        <div>
                            <Route exact path='/teacher'>
                                <Teacher />
                            </Route>
                            <Redirect to='/teacher'/>
                        </div>
                    )}
                    {this.state.authenticated && this.state.role.includes('officer') && (
                        <div>
                            <Route exact path='/officer'>
                                <Officer />
                            </Route>
                            <Redirect to='/officer'/>
                        </div>
                    )}
                    {this.state.authenticated && this.state.role.includes('admin') && (
                        <div>
                            <Route exact path='/admin'>
                                <Admin />
                            </Route>
                            <Redirect to='/admin'/>
                        </div>
                    )}
                </Switch>
            </Router>
        );
    }
}