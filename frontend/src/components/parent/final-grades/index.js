import React from 'react';
import SectionHeader from '../../utils/section-header';
import {Container, Table, InputGroup, FormControl, Pagination} from 'react-bootstrap';


export default class ParentFinalGrades extends React.Component {

    constructor(props){
        super(props);
        this.state = {
                period1: { //Hardcoded. To be replaced with real data
                    "Italian" : "8",
                    "History" : "9",
                    "Latin" : "10",
                    "Math" : "9",
                    "English" : "9",
                    "Physics" : "9",
                    "Art" : "9",
                    "Science" : "9",
                    "Gym" : "9",
                    "Religion" : "9"
                },
                period2: null,
                selectedPeriod : null,
        }
    }

    async componentDidMount(){
        await this.loadChildFinalGrades();
    }

    async loadChildFinalGrades(){
        //Load child final grades here
        this.setState({selectedPeriod: 1});
    }

    changePeriod(period){
        this.setState({
            selectedPeriod: period,
        });
    }

    render(){

    let gradesToShow = this.state.selectedPeriod === 1 ? this.state.period1 : this.state.selectedPeriod === 2 ? this.state.period2 : {};
    let finalGradesDOM =  <Table>
                        <thead>
                            <tr>
                                <th>Subject</th>
                                <th>Grade</th>
                                <th/><th/><th/><th/>
                            </tr>
                        </thead>
                        <tbody>
                            {gradesToShow !== null ? Object.entries(gradesToShow).map(grade =>
                                <tr>
                                    <td><i style={{textDecoration: 'underline'}}>{grade[0]}:</i></td>
                                    <td>
                                    <InputGroup>
                                        <FormControl
                                            placeholder="Grade is an integer value in the range [0 - 10]"
                                            value={grade[1]}
                                            disabled={true}
                                        />
                                    </InputGroup>
                                    </td>
                                    <td/><td/><td/><td/>
                                </tr>
                            ) : []}
                        </tbody>
                    </Table>

        return(
            <Container fluid>
                <SectionHeader>Final grades of the term</SectionHeader>
                
                {this.state.selectedPeriod === null &&
                    <i>This section is currently not available. This section will be enabled
                    when final grades are available. </i>
                }
                {this.state.selectedPeriod !== null &&
                <div>
                    <Pagination>
                        <Pagination style = {{marginLeft: '1%'}}>
                            <Pagination.Item  key='1' active={ 1 === this.state.selectedPeriod} disabled={this.state.period1 === null} onClick={() => this.changePeriod(1)}>Period {'1'}</Pagination.Item>
                            <Pagination.Item  key='2' active={ 2 === this.state.selectedPeriod} disabled={this.state.period2 === null} onClick={() => this.changePeriod(2)}>Period {'2'}</Pagination.Item>
                        </Pagination>
                    </Pagination>
                        {finalGradesDOM}
                </div>
                }
            </Container>
        );
    }
}