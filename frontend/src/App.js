import React from 'react';
import Parent from './components/parent/parent';
import Teacher from './components/teacher/teacher';

class App extends React.Component{

  constructor(props){
    super(props);
    this.state = {
      loggingIn: this.props.loggingIn,
      whoAmI: 'teacher', /*to be made dynamic using props because it is inherited from login component*/
    }
  }

  render(){
    return(
      <div>
        {this.state.loggingIn === true && this.state.whoAmI === 'parent' && (
          <Parent loggingIn = {this.state.loggingIn}/>
        )}
        {this.state.loggingIn === true && this.state.whoAmI === 'teacher' && (
          <Teacher loggingIn = {this.state.loggingIn}/>
        )}
      </div>
    );
  }
}

export default App;