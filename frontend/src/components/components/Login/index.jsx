import React, { Component } from 'react';
import './style.sass';

class Login extends Component {


   render() {
    
    return (
      <div>
        <form action= "">
          <input type= "text" name="email" placeholder= "Email address" className= "loginName" required /><br/>
          <input type= "password" name= "password" placeholder= "Password" className= "loginPassword" required /><br/><br/>
          <input type="submit" value= "Login"/>
        </form>
      </div>
    )
  }
}

export default Login;
