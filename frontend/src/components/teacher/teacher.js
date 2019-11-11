import React from 'react';
import styles from './styles.module.css';
import TeacherLectureSummary from './components/TeacherLectureSummary/index';

class Parent extends React.Component{


    constructor(props){
        super(props);
        this.state = {
            loggingIn: this.props.loggingIn,
            userRequest: '',
        };
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


    render(){
        return (
            <div className={styles.body}>

                
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