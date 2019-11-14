import React, { Component } from 'react';
import './style.sass';

class Dropdown extends Component {

  state = { 
    hover: false
  };

  onHover = () => {
    this.setState( {hover: true} );
  };

  onOut = () => {
    this.setState( {hover: false} );
  };
   render() {
     let details = this.props.detail.toString().split(",");
    
    return (
      <div className= "dropContainer">
        <div className= "dropHeader" onMouseOver = { this.onHover } onMouseOut= { this.onOut } >Details</div>
        <div className= { this.state.hover ? "dropBody dropShow" : "dropBody dropNoShow" } >
          { details.map(x => <div>{x}</div>) }
        </div>
      </div>
    )
  }
}

export default Dropdown;
