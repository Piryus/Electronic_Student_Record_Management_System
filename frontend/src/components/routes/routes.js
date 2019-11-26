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
            extra: this.props.appProps.extra,
            setAppProps: this.props.appProps.setAppProps
        };
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.appProps.authenticated !== prevState.authenticated) {
            return {
                authenticated: nextProps.appProps.authenticated,
                role: nextProps.appProps.role[0],
                extra: nextProps.appProps.extra
            };
        } else return null;
    }

    async logout() {
        const url = 'http://localhost:3000/logout';
        const options = {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            credentials: 'include'
        };
        await fetch(url, options);
        this.state.setAppProps(false, this.props.appProps.role, this.props.appProps.extra, this.props.appProps.setAppProps);
    }

    render() {
        const extra = this.state.extra;
        const RootComponent = cmps[this.state.role] || null;
        return (
            <Router>
                <Switch>
                    {!this.state.authenticated && (
                        <div>
                            <Route exact path='/login'>
                                <Login setAppProps={this.state.setAppProps} />
                            </Route>
                            <Redirect to='/login' />
                        </div>
                    )}
                    {this.state.authenticated && ['admin', 'officer', 'teacher', 'parent'].includes(this.state.role) && (
                        <div>
                            <Route exact path='/'>
                                <RootComponent children={extra ? extra.children : null} timetable={extra ? extra.timetable : null} onLogout={() => this.logout()} />
                            </Route>
                            <Redirect to='/' />
                        </div>
                    )}
                </Switch>
            </Router>
        );
    }
}