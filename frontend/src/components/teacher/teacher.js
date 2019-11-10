import React from 'react';
import Login from '../components/Login/index';
import styles from './styles.module.css';
import TeacherLectureSummary from './components/TeacherLectureSummary/index';

class Parent extends React.Component{


    constructor(props){
        super(props);
        this.state = {
            loggingIn: false,
            userRequest: '',
        };
        this.handleLogin = this.handleLogin.bind(this);
        this.setUserRequest = this.setUserRequest.bind(this);
    }

    renderChildItem = (item, index) => {
        return(
        <option value={item.id} >{item.surname + ' ' + item.name}</option>
        );
    }


    setUserRequest(e) {
        this.setState({userRequest: 'lectures'});
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

    render(){
        return (
            <div className={styles.body}>
                {this.state.loggingIn === false && (
                  <Login handleLogin = {this.handleLogin} />
                )}
                
                {this.state.loggingIn === true && (<div>
                    <div className={styles.header}>
                        <h1>Teacher section</h1>
                    </div>

                    <div className={styles.selectorWrapper}>

                    </div>

                        <div>
                            <table className={styles.panel}>
                                <tr>
                                    <td>
                                        <button  onClick = {this.setUserRequest} className={styles.link}>
                                            <div className={styles.panelElement}>
                                                <p>Lectures</p>
                                            </div>
                                        </button >
                                    </td>
                                </tr>
                                <tr>
                                </tr>
                            </table>

                            {this.state.userRequest === 'lectures' && (
                                <TeacherLectureSummary/>
                            )}

                       </div>
                    
                </div>
                )}   
            </div>
        );
    }
}

export default Parent;