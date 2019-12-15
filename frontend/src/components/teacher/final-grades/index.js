import React from 'react';
import SectionHeader from '../../utils/section-header';
import {Container, Button, Card, Accordion, Table, InputGroup, FormControl, Alert, Pagination} from 'react-bootstrap';


export default class FinalGrades extends React.Component {
    constructor(props){
        super(props);

        this.state = {
            enableSection: false,
            enableProcedure: false,
            computedGrades: [],
            satisfiedRequest: false,
            selectedPeriod: 1,
            effectivePeriod: 1,
            periods: [1],
            success: '',
            error: '',
            warning: '',
            classSubjects: [ //HARDCODED
                "Italian",
                "History",
                "Latin",
                "Math",
                "English",
                "Physics",
                "Art",
                "Science",
                "Gym",
                "Religion"
            ],
            json: []
        };
    }

    async componentDidMount(){
        //Check if is section enabled first
        await this.isSectionEnabled();
    }

    loadDataByPeriod(){
        var suggestedGrades = [];
        var found;

        if(this.state.selectedPeriod === 1 && this.state.effectivePeriod === 1){
            suggestedGrades = this.state.json.gradesSuggestions[0]; //Show suggested grades for first
        } else if(this.state.selectedPeriod === 1 && this.state.effectivePeriod === 2){
            suggestedGrades = this.state.json.termGrades[0]; //Show recorded grades for first period
        } else if(this.state.selectedPeriod === 2 && this.state.effectivePeriod === 2){
            suggestedGrades = this.state.json.gradesSuggestions[1]; //Show suggested grades for second period
        } else if(this.state.selectedPeriod === 1 && this.state.effectivePeriod === 3){
            suggestedGrades = this.state.json.termGrades[0]; //Show recorded grades for first period
        } else if(this.state.selectedPeriod === 2 && this.state.effectivePeriod === 3){
            suggestedGrades = this.state.json.termGrades[1]; //Show recorded grades for second period
        }
        var student;
        suggestedGrades = suggestedGrades.map(s => {
            student = {
                id: s.studentId,
                name: s.surname + " " + s.name,
                grades: Object.entries(s.grades).map((value) => {
                    return {subjectName: value[0], suggestedGrade: value[1].toString(), integerGrade:  Math.trunc( value[1] ).toString()};
                })
            }
            this.state.classSubjects.forEach(subject => {

                found = student.grades.find(sbj => sbj.subjectName === subject);
                if(found === undefined){
                    student.grades.push({subjectName: subject, suggestedGrade: "(n. d.)", integerGrade: ""});
                }
            });

            return student;
        });

        this.setState({
            enableSection: true,
            computedGrades: suggestedGrades,
        });
    }

    changePeriod(period){
        this.setState({
            selectedPeriod: period,
            warning: '',
            success: '',
            error: ''
        }, () => this.loadDataByPeriod());
    }

    isSectionEnabled = async () => {
        //Query to backend here
        try{
            const url = 'http://localhost:3000/term/grades';
            const options = {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
            };
            let response = await fetch(url, options);
            var json = await response.json();
            // json = { //TO BE USED ONLY FOR DEMO and DEBUG
            //     assigned: [false, true],
            //     termGrades: [[{studentId: "ddcdc", name: "kdcc", surname: "dcdic", grades: {"italian" : 10}}], [{studentId: "ddcdc", name: "kdcc", surname: "dcdic", grades: {"history" : 2}}]],
            //     gradesSuggestions: [json.gradesSuggestions[0], json.gradesSuggestions[0]]
            // }
            if(!json.assigned.includes(false)){
                //After second period
                this.setState({
                    enableSection: false,
                    effectivePeriod: 3,
                    periods: [1, 2],
                    selectedPeriod: 2,
                    json: json
                });
            }
            else if(json.assigned[0] === false){
                //It's first period
                this.setState({
                    enableSection: false,
                    effectivePeriod: 1,
                    periods: [1],
                    selectedPeriod: 1,
                    json: json
                });
            } else if(json.assigned[0] === true && json.assigned[1] === false){
                //It's second period
                this.setState({
                    enableSection: false,
                    effectivePeriod: 2,
                    periods: [1, 2],
                    selectedPeriod: 2,
                    json: json
                });
            }
            this.loadDataByPeriod();
        }
        catch(e){
            this.setState({
                enableSection: false,
                error: 'Ops! Section disabled due to internal error.',
                success: '',
                warning:''
            });
        }
    }

    updateGrade(e, subject, studentId){
        let computedGrades = this.state.computedGrades;
        let index = computedGrades.findIndex(e => e.id === studentId);
        let index2 = computedGrades[index].grades.findIndex(g => g.subjectName === subject);
        computedGrades[index].grades[index2].integerGrade = e.target.value;
        this.setState({computedGrades: computedGrades});
    }

    async postGrades(event){
        event.preventDefault();
        let notValidGrade = undefined;
        for(var i in this.state.computedGrades){
            notValidGrade = this.state.computedGrades[i].grades.find(grade => grade.integerGrade === '' || isNaN(grade.integerGrade) || grade.integerGrade.includes('.') || parseInt(grade.integerGrade) < 0 || parseInt(grade.integerGrade) >10);
            if(notValidGrade !== undefined){
                break;
            }
        }
        if(notValidGrade !== undefined){
            this.setState({
                warning: 'Please insert all grades as integer numbers in the range [0 - 10] for each subject and for each student.',
                success: '',
                error: ''
            });
        } else {
            //Prepare data here
            let data = [];
            let grades;
            data = this.state.computedGrades.map(student => {
                grades = {};
                student.grades.forEach(grade => grades[grade.subjectName] = parseInt(grade.integerGrade));
                return {
                    studentId: student.id,
                    grades: grades
                };
            });
            await this.sendDataToBackend(data);
            await this.isSectionEnabled();
        }
    }

    async sendDataToBackend(data){
        //send data to backend here
        try{
            const url = 'http://localhost:3000/term/grades';
            const options = {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({
                    grades: data
                }),
            };
            const response = await fetch(url, options);
            if(response.error != null){
                this.setState({
                    enableProcedure: false,
                    success: '',
                    warning: '',
                    error: 'Ops! Internal error. Please retry.',
                });
            } else {
                this.setState({
                    enableProcedure: false, //Send request again to db for
                    success: 'Grades have been recorded successfully!',
                    warning: '',
                    error: '',
                });
            }
        }
        catch(e){
            this.setState({
                enableProcedure: false,
                success: '',
                warning: '',
                error: 'Ops! Internal error. Please retry.',
            });
        }
    }

    cancelProcedure(event){
        event.preventDefault();
        this.setState({
            enableProcedure: false,
            isSectionEnabled: false,
            success: '',
            warning: 'Procedure canceled.',
            error: ''
        });
    }


    render(){

        let studentsDOM = [];
        if(this.state.computedGrades.length !== 0 && this.state.enableProcedure === true){
            studentsDOM = this.state.computedGrades.map(s => {
                return (<Card>
                    <Card.Header>
                        <Accordion.Toggle as={Button} variant="link" eventKey={s.id}>
                            {s.name}
                        </Accordion.Toggle>
                    </Card.Header>
                    <Accordion.Collapse eventKey={s.id}>
                    <Table>
                        <thead>
                            <tr>
                                <th>Subject</th>
                                <th>Grade</th>
                                {this.state.selectedPeriod === this.state.effectivePeriod && <th>Average</th>}
                                <th/><th/><th/><th/>
                            </tr>
                        </thead>
                        <tbody>
                            {s.grades.map(grade =>
                                <tr>
                                    <td><i style={{textDecoration: 'underline'}}>{grade.subjectName}:</i></td>
                                    <td>
                                    <InputGroup>
                                        <FormControl
                                            placeholder="Grade is an integer value in the range [0 - 10]"
                                            value={grade.integerGrade}
                                            onChange={(e) => this.updateGrade(e, grade.subjectName, s.id)}
                                            disabled={this.state.selectedPeriod !== this.state.effectivePeriod}
                                        />
                                    </InputGroup>
                                    </td>
                                    {this.state.selectedPeriod === this.state.effectivePeriod && <td>{grade.suggestedGrade}</td>}
                                    <td/><td/><td/><td/>
                                </tr>
                            )}
                        </tbody>
                    </Table>
                    </Accordion.Collapse>
                </Card>);
            });
        }

        return(
            <Container fluid>
                <SectionHeader>Final grades of the term</SectionHeader>
                {this.state.success !== '' && this.state.warning === '' && this.state.error === '' &&(
                    <Alert variant="success">{this.state.success}</Alert>
                )}
                {this.state.success === '' && this.state.warning !== '' && this.state.error === '' &&(
                    <Alert variant="warning">{this.state.warning}</Alert>
                )}
                {this.state.success === '' && this.state.warning === '' && this.state.error !== '' &&(
                    <Alert variant="danger">{this.state.error}</Alert>
                )}
                {this.state.enableSection === false &&
                    <i>This section is currently not available. This section will be enabled
                    when it is time to enter final grades of the term. </i>
                }
                {this.state.enableSection === true && this.state.enableProcedure === false &&
                    <div style={{textAlign: 'center'}}>
                        <h6>You can publish or view Final Grades of the term for class:</h6><h2 style={{color: 'red'}}>{this.props.coordinator.name}</h2>
                        <p>By pressing the "Start" button here below the procedure will start.</p>
                        <Button variant="danger" onClick={() => this.setState({enableProcedure: true, success: '', error: '', warning: ''})}>START</Button>
                    </div>
                }
                {this.state.enableProcedure === true &&
                <div>
                    <Pagination>
                        {this.state.selectedPeriod === this.state.effectivePeriod && <Button variant="outline-success" onClick={(event) => this.postGrades(event)}>Publish</Button>}
                        {this.state.selectedPeriod === this.state.effectivePeriod && <Button variant="danger" style={{marginLeft: '1%'}} onClick={(event) => this.cancelProcedure(event)}>Cancel procedure</Button>}
                        <Pagination style = {{marginLeft: '1%'}}>
                            {this.state.periods.map(period =>
                                <Pagination.Item  key={period} active={ period === this.state.selectedPeriod} disabled={this.state.periods.length === 1} onClick={() => this.changePeriod(period)}>Period {period}</Pagination.Item>
                            )}
                        </Pagination>
                    </Pagination>
                    <Accordion className="mt-3" defaultActiveKey="0">
                        {studentsDOM.map(student => student)}
                    </Accordion>
                </div>
                }
            </Container>
        );
    }
}