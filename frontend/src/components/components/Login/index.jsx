import React, { Component } from 'react';
import {BrowserRouter as Router, Switch, Route, Redirect} from "react-router-dom";
import App from '../../../App'
import './style.sass';

class Login extends Component {

  
    constructor(props){
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
      {this.state.loggingIn === false && (<div className= "loginContainer">
        <form className="loginForm" onSubmit={event => { event.preventDefault(); this.handleLogin(this.state.username, this.state.password); }}>
          <input type= "text" name="email" placeholder= "Email address" className= "loginName" onChange = {(e) => this.setState({username: e.target.value})} required /><br/>
          <input type= "password" name= "password" placeholder= "Password" className= "loginPassword" onChange={(e) => this.setState({password: e.target.value})} required /><br/><br/>
          <button className="loginButton">Login</button>
        </form>
 
      </div>
      )}
      {this.state.loggingIn === true && (
        <Router>
            <Switch>
                <Route path='/home' render={(props) => <App {...props} loggingIn={this.state.loggingIn}/>} />
                <Redirect to='/home' />)
            </Switch>
        </Router>
      )

      }
      </div>
    )
  }
}

export default Login;
