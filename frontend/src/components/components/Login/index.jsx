import React, { Component } from 'react';
import './style.sass';

class Login extends Component {

  

    state = {
      username: '',
      password: ''
    };

 

   render() {
    return (
      <div>
        <form>
          <input type= "text" name="email" placeholder= "Email address" className= "loginName" onChange = {(e) => this.setState({username: e.target.value})} required /><br/>
          <input type= "password" name= "password" placeholder= "Password" className= "loginPassword" onChange={(e) => this.setState({password: e.target.value})} required /><br/><br/>
          <button onClick = {() => this.props.handleLogin(true)}>Login</button>
        </form>
 
      </div>
    )
  }
}

export default Login;
