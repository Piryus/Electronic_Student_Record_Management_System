import React from 'react';
import SearchBar from './search-bar/officer-parent-access-search-bar';
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
        this.updateSuggestions = this.updateSuggestions.bind(this);
        this.updateStudentFound = this.updateStudentFound.bind(this);
        this.suggestionSelected = this.suggestionSelected.bind(this);
        this.functionToFixElements = this.functionToFixElements.bind(this);
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

    functionToFixElements = (elements) => {
        let vect = [];
        elements.map((item) => vect.push(item.surname + ' ' + item.name + ' ' + item.ssnCode));
        return vect;
    }

    updateStudentFound = (value) => {
        this.setState({studentFound: value});
    }

    updateSuggestions = (value) => {
        this.setState({suggestions: value});
    }

    suggestionSelected = (value) => {
        this.setState({
            studentFound: value,
        });
    }

    submitChildForm(){

        if(this.state.studentFound === '' || this.state.suggestions.length === 0){
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
                            <SearchBar updateStudent = {this.updateStudentFound} elementFound = {this.state.studentFound} elements = {this.state.students} functionToFixElements = {this.functionToFixElements} suggestions = {this.state.suggestions} updateSuggestions = {this.updateSuggestions} updateSuggestionSelected = {this.suggestionSelected}/>
                            <span className={styles.selectedSpan}>Selected: </span><span className={styles.selectedEffectivelySpan}>{this.state.studentFound}</span>
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