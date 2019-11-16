import React from 'react';
//import styles from './styles.module.css';


class SearchBar extends React.Component{

    constructor(props){
        super(props);

        this.state = {
            elementFound: this.props.elementFound,
            elements: this.props.elements,
            suggestions: this.props.suggestions,
        }

    }

    onTextChanged = (e) => {
        const value = e.target.value;
        let sugg = [];
        let vect = [];
        this.props.updateStudent(value);
        this.setState({elementFound: value});
        if(value.length >= 3){
            const regex = new RegExp(`${value}`, 'i');
            vect = this.props.functionToFixElements(this.state.elements);
            sugg = vect.filter(v => regex.test(v));
        }
        this.setState({suggestions: sugg});
        this.props.updateSuggestions(sugg);
    }

    renderSuggestions(){
        const  sugg = this.state.suggestions;
        if(sugg.lenght === 0){
            return null;
        }
        return(
            <ul >Stundents found:<br/>
                {sugg.map((item) => <li onClick={() => this.suggestionSelected(item)} >{item}</li>)}
            </ul>
        );
    }

    suggestionSelected = (value) => {
        this.setState({
            elementFound: value,
        });
        this.props.updateSuggestionSelected(value);
    }

    render(){
        return(
            <div>
                <input value={this.state.elementFound} type= "text" name="email" placeholder= "Search by SNN code or Surname"  onChange = {this.onTextChanged} required /><br/>
                {this.renderSuggestions()}
            </div>
        );
    }
}

export default SearchBar;