import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import {BrowserRouter as Router, Switch, Route} from "react-router-dom";
import App from './App';
import Admin from './components/admin/admin';
import Officer from './components/officer/officer';
import Teacher from './components/teacher/teacher';
import Parent from './components/parent/parent';
import * as serviceWorker from './serviceWorker';

//ReactDOM.render(<App />, document.getElementById('root'));

const routing = (
    <Router>
        <Switch>
            <Route exact path='/' render={() => <App />} />
            <Route path="/teacher" render={(props) => <Teacher {...props} />} />
            <Route path="/parent" render={(props) => <Parent {...props} />} />
            <Route path="/officer" render={(props) => <Officer {...props} />} />
            <Route path='/admin' render={(props) => <Admin {...props} />} />
        </Switch>
    </Router>
);

ReactDOM.render(routing, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
