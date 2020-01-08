import React from 'react';
import SectionHeader from '../../utils/section-header';
import {Container, Table, InputGroup, FormControl, Pagination} from 'react-bootstrap';
import LoadingSpinner from "../../utils/loading-spinner";



export default class ParentFinalGrades extends React.Component {

    constructor(props){
        super(props);
        this.state = {
                period1: null,
                period2: null,
                selectedPeriod : null,
                isLoading: true
        }
    }

    async componentDidMount(){
        await this.loadChildFinalGrades();
    }

    async componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.child._id !== this.props.child._id) {
            await this.loadChildFinalGrades();
        }
    }

    async loadChildFinalGrades(){
        // Query child's grades
        const url = 'http://localhost:3000/grades/' + this.props.child._id + '/term';
        const options = {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            credentials: 'include',
        };
        let response = await fetch(url, options);
        const json = await response.json();
        if(json.termGrades === undefined || json.termGrades.length === 0){
            this.setState({selectedPeriod: null, isLoading: false});
        } else if(json.termGrades.length === 1){
            this.setState({
                period1: json.termGrades[0],
                period2: null,
                selectedPeriod: 1,
                isLoading: false
            });
        } else if(json.termGrades.length === 2){
            this.setState({
                period1: json.termGrades[0],
                period2: json.termGrades[1],
                selectedPeriod: 1,
                isLoading: false
            });
        }
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
                {this.state.isLoading && <LoadingSpinner/>}
                {!this.state.isLoading && this.state.selectedPeriod === null &&
                    <i>This section is currently not available. This section will be enabled
                    when final grades are available. </i>
                }
                {!this.state.isLoading && this.state.selectedPeriod !== null &&
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