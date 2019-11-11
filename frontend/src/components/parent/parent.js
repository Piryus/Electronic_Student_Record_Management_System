import React from 'react';
import Grades from './components/grades';
import styles from './styles.module.css';

class Parent extends React.Component{


    constructor(props){
        super(props);
        this.state = {
            userRequest: '',
            loggingIn: this.props.loggingIn,
            childSelected: 'JD1',
            child: [
                {
                    name: 'John',
                    surname: 'Doe',
                    id: 'JD1'
                },
                {
                    name: 'Walter',
                    surname: 'White',
                    id: 'WW1'
                }
            ]
        };
        this.setUserRequest = this.setUserRequest.bind(this);
    }

    renderChildItem = (item, index) => {
        return(
        <option value={item.id} >{item.surname + ' ' + item.name}</option>
        );
    }

    selectChild = (e) => {
        this.setState({
            childSelected: e.target.value,
            userRequest: ''
        });
    }

    setUserRequest(e) {
        this.setState({userRequest: 'grades'});
    }

    // handleLogin(username, password) {
    //     const url = 'http://localhost:3000/login';
    //     const options = {
    //         method: 'POST',
    //         headers: {
    //             'Accept': 'application/json',
    //             'Content-Type': 'application/json'
    //         },
    //         body: JSON.stringify({
    //             mail: username,
    //             password: password
    //         })
    //     };
    //     fetch(url, options)
    //         .then(response => response.json())
    //         .then(response => {
    //             if (response.success === true) {
    //                 this.setState({loggingIn: true});
    //             } else {
    //                 // Connection rejected handler
    //                 console.log(response);
    //             }
    //         })
    //         .catch(error => {
    //             console.log(error)
    //         });
    // }

    render(){
        return (
            <div className={styles.body}>

                
                {this.state.loggingIn === true && (<div>
                    <div className={styles.header}>
                        <h1>Parent section</h1>
                    </div>

                    <div className={styles.selectorWrapper}>
                        <select className={styles.childSelector} onChange={(e) => this.selectChild(e)}>
                            {this.state.child.map(this.renderChildItem)}
                        </select>
                    </div>

                        <div>
                            <table className={styles.panel}>
                                <tr>
                                    <td>
                                        <button  onClick = {this.setUserRequest} className={styles.link}>
                                            <div className={styles.panelElement}>
                                                <p>Grades</p>
                                            </div>
                                        </button >
                                    </td>
                                </tr>
                                <tr>
                                </tr>
                            </table>

                            {this.state.userRequest === 'grades' && (
                                <Grades  childId = {this.state.childSelected} />
                            )}

                       </div>
                    
                </div>
                )}   
            </div>
        );
    }
}

export default Parent;