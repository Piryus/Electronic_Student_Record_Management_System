import React, {Component} from 'react';
import './login.sass';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Alert from 'react-bootstrap/Alert';

class Login extends Component {

    constructor(props) {
        super(props);
        this.state = {
            username: '',
            password: '',
            error: false,
            errorUnknown: false,
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
                    let children = [];
                    if (response.hasOwnProperty('children')) {
                        children = response.children;
                    }
                    this.props.setAppProps(true, response.scope, children);
                } else {
                    // Connection rejected handler
                    console.log(response);
                    this.setState({password: '', error: true, unknownError: false});
                }
            })
            .catch(error => {
                console.log(error);
                this.setState({password: '', unknownError: true, error: false});
            });

    }

    render() {
        let error;
        if (this.state.error) {
            error = <Alert variant={'danger'} >Sorry, the mail or password was incorrect.</Alert>
        }
        if (this.state.unknownError) {
            error = <Alert variant={'danger'} >Sorry, an unknown error happened... It's not you, it's us.</Alert>
        }
        return (<div className="loginContainer">
                <h2 className={'loginText'}>Log in to continue</h2>
                {error}
                <Form onSubmit={event => {
                    event.preventDefault();
                    this.handleLogin(this.state.username, this.state.password);
                }}>
                    <Form.Control value={this.state.username} type="email" placeholder="Email address"
                                  onChange={(e) => this.setState({username: e.target.value})}/>
                    <Form.Control value={this.state.password} type="password" name="password" placeholder="Password"
                                  onChange={(e) => this.setState({password: e.target.value})} required/>
                    <Button disabled={!this.validateForm()} type="submit" block>Log in</Button>
                </Form>
            </div>
        );
    }
}

export default Login;
