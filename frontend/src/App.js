import React from 'react';
import logo from './logo.svg';
import './App.css';
import Title from './components/SubjectAndGrade/Title';
import SubjectAndGrade from './components/SubjectAndGrade';

function App() {
  return (
    <div className="App">
      { /* <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noref
        </a>
      </header> */ }
      <Title />
      <SubjectAndGrade subject="Math" grade="10"  details= "29/10/2019 9.0, 23/09/2019 8.0, 09/08/2019 9.0, 02/10/2019 7.0" />
      <SubjectAndGrade subject="Physics" grade="9" details= "27/10/2019 6.0, 28/09/2019 8.5, 11/08/2019 9.0, 22/10/2019 7.0" />
      <SubjectAndGrade subject="Chemistry" grade="8" details= "23/10/2019 9.0, 19/09/2019 8.0, 05/08/2019 9.0, 18/10/2019 7.0" />
    </div>
  );
}

export default App;
