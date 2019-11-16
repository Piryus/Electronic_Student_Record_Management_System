import React from 'react';
import {BrowserRouter as Router, Switch, Route, Redirect} from "react-router-dom";
import Login from "../login/login";
import Parent from "../parent/parent";
import Teacher from "../teacher/teacher";
import Officer from "../officer/officer";
import Admin from '../admin/admin';

const cmps = {
    admin: Admin,
    officer: Officer,
    teacher: Teacher,
    parent: Parent
};

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
                role: nextProps.appProps.role[0],
                children: nextProps.appProps.children
            };
        } else return null;
    }

    render() {
        const RootComponent = cmps[this.state.role] || null;
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
                    {this.state.authenticated && ['admin', 'officer', 'teacher', 'parent'].includes(this.state.role) && (
                        <div>
                            <Route exact path='/'>
                                <RootComponent children={this.state.children} />
                            </Route>
                            <Redirect to='/'/>
                        </div>
                    )}
                </Switch>
            </Router>
        );
    }
}