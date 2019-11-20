import React, {Component} from 'react';
import styles from './login.module.css';
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
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({
                mail: username,
                password: password
            })
        };
        fetch(url, options)
            .then(response => response.json())
            .then(response => {
                if(response.success === true) {
                    this.props.setAppProps(true, response.scope, response.extra);
                } else {
                    // Connection rejected handler
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
            error = <Alert variant={'danger'}>Sorry, the mail or password was incorrect.</Alert>
        }
        if (this.state.unknownError) {
            error = <Alert variant={'danger'}>Sorry, an unknown error happened... It's not you, it's us.</Alert>
        }
        return (
            <div className={styles.root}>
                <div className={styles.loginContainer}>
                    <h2 className={styles.loginText}>Log in to continue</h2>
                    {error}
                    <Form onSubmit={event => {
                        event.preventDefault();
                        this.handleLogin(this.state.username, this.state.password);
                    }}>
                        <Form.Control value={this.state.username} type="email" name="username" placeholder="Email address"
                                      onChange={(e) => this.setState({username: e.target.value})} required />
                        <Form.Control value={this.state.password} type="password" name="password" placeholder="Password"
                                      onChange={(e) => this.setState({password: e.target.value})} required />
                        <Button disabled={!this.validateForm()} type="submit" block>Log in</Button>
                    </Form>
                </div>
            </div>
        );
    }
}

export default Login;
