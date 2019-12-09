import React from 'react';
import SectionHeader from '../../utils/section-header';
import {Container, Button} from 'react-bootstrap';


export default class FinalGrades extends React.Component {
    constructor(props){
        super(props);

        this.state = {
            enableSection: false,
            enableProcedure: false,
            allClasses: this.props.allClasses === undefined ? [] : this.props.allClasses
        };
    }

    async componentDidMount(){
        //Check if is section enabled first
        await this.isSectionEnabled();
    }

    async isSectionEnabled(){
        //Query to backend here
        this.setState({enableSection: true});
    }

    render(){
        return(
            <Container fluid>
                <SectionHeader>Final grades of the term</SectionHeader>
                {this.state.enableSection === false &&
                    <i>This section is currently not available. This section will be enabled
                    when it is time to enter final grades of the term. </i>
                }
                {this.state.enableSection === true && this.state.enableProcedure === false &&
                    <div style={{textAlign: 'center'}}>
                        <p>By pressing the "Start" button here below the procedure will start.</p>
                        <Button variant="danger" onClick={() => this.setState({enableProcedure: true})}>START</Button>
                    </div>
                }

            </Container>
        );
    }
}