import React from 'react';
import styles from './styles.module.css';

class ParentAccountEnabling extends React.Component{

    constructor(props){
        super(props);
        this.state = {
            validParentEmail: false,
            responseMessage: '',
            parentEmail: '',
            studentFound: '',
            showConfirmation: false,
            ssnChosen: '', //Student chosen
            students: [
                {
                    name: 'Giovanni',
                    surname: 'Verdi',
                    ssnCode: 'GVVVV1'
                },
                {
                    name: 'Mario',
                    surname: 'Rossi',
                    ssnCode: 'GVVVV2'
                },
                {
                    name: 'Marco',
                    surname: 'Bianchi',
                    ssnCode: 'MBBBB1'
                }
            ],
            suggestions: [],
        }
    }

    validateEmail(){
        var re = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/igm;
        return re.test(String(this.state.parentEmail).toLowerCase());
    }

    submitForm(){
        if(this.validateEmail() === false){
            alert("Please insert a valid email.");
        }
        else{
            this.setState({validParentEmail: true});
        }
    }


    resetPage = () => {
        this.setState({
            validParentEmail: false,
            responseMessage: '',
            parentEmail: '',
            studentFound: '',
            ssnChosen: '', //Student chosen
            suggestions: [],
            showConfirmation: false,
        });
    }

    sendRequestToBackend = () => {
        //Send here request to backend
        alert('Response from server');
        this.resetPage();
    }

    submitChildForm(){

        if(this.state.studentFound === '' || this.state.suggestions.length == 0){
            alert('Please specify an existing student.');
        }else{
            var res = this.state.studentFound.split(" ");

            if(res[2] != null){
            this.setState({
                ssnChosen: res[2],
                showConfirmation: true,
            });
            }
        }
 
    }

    onTextChanged = (e) => {
        const value = e.target.value;
        let sugg = [];
        let vect = [];
        this.setState({studentFound: value});
        if(value.length >= 3){
            const regex = new RegExp(`${value}`, 'i');
            this.state.students.map((item) => vect.push(item.surname + ' ' + item.name + ' ' + item.ssnCode));
            sugg = vect.filter(v => regex.test(v));
        }
        this.setState({suggestions: sugg});
    }

    renderSuggestions(){
        const  sugg = this.state.suggestions;
        if(sugg.lenght == 0){
            return null;
        }
        return(
            <ul className={styles.suggestions}>Stundents found:<br/>
                {sugg.map((item) => <li onClick={() => this.suggestionSelected(item)} className={styles.studentFound}>{item}</li>)}
            </ul>
        );
    }

    suggestionSelected(value){
        this.setState({
            studentFound: value,
        });
    }


    render(){
        return (
            <div>

                <div className={styles.parentEmailContainer}>
                {this.state.validParentEmail === false && this.state.showConfirmation === false &&(
                    <div>
                        <span className={styles.parentEmailSpan}>Insert a parent's email..</span><br/>
                        <form className={styles.parentForm} onSubmit={event => { event.preventDefault(); this.submitForm();}}>
                            <input type= "text" name="email" placeholder= "Parent Email" className={styles.inputEmail} onChange = {(e) => this.setState({parentEmail: e.target.value})} required /><br/>
                            <button className={styles.continueButton}>Continue</button>
                            <button onClick={this.resetPage} className={styles.cancelButton}>Cancel</button>
                        </form>
                    </div>
                )}
                {this.state.validParentEmail === true  && this.state.showConfirmation === false &&(
                    <div>
                        <span className={styles.parentEmailSpan}>Choose a Student from the panel on the right..</span><br/>
                        <form className={styles.parentForm} onSubmit={event => { event.preventDefault(); this.submitChildForm();}}>
                            <input value={this.state.studentFound} type= "text" name="email" placeholder= "Search by SNN code or Surname" className={styles.inputEmail} onChange = {this.onTextChanged} required /><br/>
                            {this.renderSuggestions()}
                            <button className={styles.continueButton}>Continue</button>
                            <button onClick={this.resetPage} className={styles.cancelButton}>Cancel</button>
                        </form>

                    </div>
                )}
                {this.state.showConfirmation === true && (
                    <div>
                        <span className={styles.descriptionSpan}>Email of parents's account: </span><span className={styles.finalEmail}>{this.state.parentEmail}</span><br></br>
                        <span className={styles.descriptionSpan2}>Related student: </span><span className={styles.finalStudent}>{this.state.studentFound}</span><br></br>
                        <button onClick={this.sendRequestToBackend} className={styles.continueButtonFinal}>Confirm</button>
                        <button onClick={this.resetPage} className={styles.cancelButtonFinal}>Cancel</button>
                    </div>
                )}
                </div>
            </div>
        );
    }


}

export default ParentAccountEnabling;