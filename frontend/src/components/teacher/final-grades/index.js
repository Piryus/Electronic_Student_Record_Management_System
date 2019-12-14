import React from 'react';
import SectionHeader from '../../utils/section-header';
import {Container, Button, Card, Accordion, Table, InputGroup, FormControl, Alert} from 'react-bootstrap';


export default class FinalGrades extends React.Component {
    constructor(props){
        super(props);

        this.state = {
            enableSection: false,
            enableProcedure: false,
            computedGrades: [],
            satisfiedRequest: false,
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
        };
    }

    async componentDidMount(){
        //Check if is section enabled first
        await this.isSectionEnabled();
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
            const json = await response.json();

            if(!json.assigned.includes(false)){
                //Section is disabled
                this.setState({enableSection: false});
            }
            else{
                var suggestedGrades = [];
                var found;
                if(json.assigned[0] === false && json.assigned[1] === false){
                    //First period
                    suggestedGrades = json.gradesSuggestions[0];
                } else if(json.assigned[0] === true && json.assigned[1] === false){
                    //Second period
                    suggestedGrades = json.gradesSuggestions[1];
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
            notValidGrade = this.state.computedGrades[i].grades.find(grade => grade.integerGrade === '' || isNaN(grade.integerGrade) || parseInt(grade.integerGrade) < 0 || parseInt(grade.integerGrade) >10);
            if(notValidGrade !== undefined){
                break;
            }
        }
        if(notValidGrade !== undefined){
            this.setState({
                warning: 'Please insert a grade in the range [0 - 10] for each subject and for each student.',
                success: '',
                error: ''
            });
        } else {
            //Prepare data here
            let data = [];
            await this.sendDataToBackend(data);
            console.log(this.state.computedGrades);
            this.setState({
                enableProcedure: false, //Send request again to db for
                success: 'Grades have been recorded successfully!',
                warning: '',
                error: ''
            });
        }
    }

    async sendDataToBackend(data){
        //send data to backend here
    }

    cancelProcedure(event){
        event.preventDefault();
        this.setState({
            enableProcedure: false, //Send request again to db for
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
                                <th>Computed</th>
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
                                        />
                                    </InputGroup>
                                    </td>
                                    <td>{grade.suggestedGrade}</td>
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
                        <h6>You can publish Final Grades of the term for class:</h6><h2 style={{color: 'red'}}>{this.props.coordinator.name}</h2>
                        <p>By pressing the "Start" button here below the procedure will start.</p>
                        <Button variant="danger" onClick={() => this.setState({enableProcedure: true})}>START</Button>
                    </div>
                }
                {this.state.enableProcedure === true &&
                <div>
                    <Button variant="outline-success" onClick={(event) => this.postGrades(event)}>Publish Grades</Button>
                    <Button variant="danger" style={{marginLeft: '2%'}} onClick={(event) => this.cancelProcedure(event)}>Cancel procedure</Button>
                    <Accordion className="mt-3" defaultActiveKey="0">
                        {studentsDOM.map(student => student)}
                    </Accordion>
                </div>
                }
            </Container>
        );
    }
}