import React from 'react';
import ParentAccountEnabling from '../components/ParentAccountEnabling/index';
import styles from './styles.module.css';

class Officer extends React.Component{


    constructor(props){
        super(props);
        this.state = {
            userRequest: '',
            loggingIn: this.props.loggingIn,
        };
        this.setUserRequest = this.setUserRequest.bind(this);
    }

    setUserRequest(e, choice) {
        this.setState({userRequest: choice});
    }



    render(){
        return (
            <div className={styles.body}>

                
                {this.state.loggingIn === true && (<div>
                    <div className={styles.header}>
                        <h1>Officer section</h1>
                    </div>

                        <div>
                            <table className={styles.panel}>
                                <tr>
                                    <td>
                                        <button  onClick = {(e) => this.setUserRequest(e, "accounts")} className={styles.link}>
                                            <div className={styles.panelElement}>
                                                <p>Parents Accounts</p>
                                            </div>
                                        </button >
                                    </td>
                                </tr>
                                <tr>
                                </tr>
                            </table>

                            {this.state.userRequest === 'accounts' && (
                                <ParentAccountEnabling />
                            )}

                       </div>
                    
                </div>
                )}   
            </div>
        );
    }
}

export default Officer;