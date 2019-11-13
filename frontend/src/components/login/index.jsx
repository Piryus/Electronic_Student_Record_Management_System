import React, {Component} from 'react';
import {BrowserRouter as Router, Switch, Route, Redirect} from "react-router-dom";
import App from '../App/App'
import './style.sass';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

class Login extends Component {


    constructor(props) {
        super(props);
        this.state = {
            username: '',
            password: '',
            loggingIn: false
        };
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
        this.setState({loggingIn: true});
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


    render() {
        return (
            <div>
                {this.state.loggingIn === false && (
                    <div className="loginContainer">
                        <h2 className={'loginText'}>Log in to continue</h2>
                        <Form onSubmit={event => {
                            event.preventDefault();
                            this.handleLogin(this.state.username, this.state.password);
                        }}>
                            <Form.Control type="email" placeholder="Email address"
                                          onChange={(e) => this.setState({username: e.target.value})}/>
                            <Form.Control type="password" name="password" placeholder="Password"
                                          onChange={(e) => this.setState({password: e.target.value})} required/>
                            <Button type="submit" block>Log in</Button>
                        </Form>
                    </div>
                )}
                {this.state.loggingIn === true && (
                    <Router>
                        <Switch>
                            <Route path='/home' render={(props) => <App {...props} loggingIn={this.state.loggingIn}/>}/>
                            <Redirect to='/home'/>)
                        </Switch>
                    </Router>
                )

                }
            </div>
        )
    }
}

export default Login;
