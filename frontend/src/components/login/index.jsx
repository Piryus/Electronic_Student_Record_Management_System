import React, {Component} from 'react';
import './style.sass';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

class Login extends Component {

    constructor(props) {
        super(props);
        this.state = {
            username: '',
            password: ''
        };
    }

    validateForm() {
        return this.state.password.length >= 8;
    }

    async handleLogin(username, password) {
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
                    this.props.setAppProps(true, response.scope);
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
        return (<div className="loginContainer">
                <h2 className={'loginText'}>Log in to continue</h2>
                <Form onSubmit={event => {
                    event.preventDefault();
                    this.handleLogin(this.state.username, this.state.password);
                }}>
                    <Form.Control type="email" placeholder="Email address"
                                  onChange={(e) => this.setState({username: e.target.value})}/>
                    <Form.Control type="password" name="password" placeholder="Password"
                                  onChange={(e) => this.setState({password: e.target.value})} required/>
                    <Button disabled={!this.validateForm()} type="submit" block>Log in</Button>
                </Form>
            </div>
        );
    }
}

export default Login;
