import React from 'react';
import SectionHeader from '../../utils/section-header';
import {Container, Button, Card, Accordion, Table, InputGroup, FormControl, Alert} from 'react-bootstrap';


export default class FinalGrades extends React.Component {
    constructor(props){
        super(props);

        this.state = {
            enableSection: false,
            enableProcedure: false,
            allClasses: this.props.allClasses === undefined ? [] : this.props.allClasses,
            computedGrades: [],
            satisfiedRequest: false
        };
    }

    async componentDidMount(){
        //Check if is section enabled first
        await this.isSectionEnabled();
        if(this.state.enableSection === true){
            await this.downloadComputedGrades();
        }
    }

    async componentWillReceiveProps(){
        //Query to backend here if new class selected needs the grades to be recorded
        await this.isSectionEnabled();
        this.setState({
            enableProcedure: false,
            allClasses: this.props.allClasses === undefined ? [] : this.props.allClasses,
            satisfiedRequest: false
        })
    }

    async downloadComputedGrades(){
        //Download grades here by sending classId
        this.setState({computedGrades:
            [
                {
                    id: "studentId",
                    name: "studendName",
                    grades: {
                            "SubjectName" : "10",
                            "SubjectName2" : "8"
                    }
                },
                {
                    id: "studentId2",
                    name: "studendName2",
                    grades: {
                            "SubjectName4" : "7",
                            "SubjectName25" : "2"
                    }
                }
            ]
        });
    }

    isSectionEnabled = async () => {
        //Query to backend here
        this.setState({enableSection: true});
    }

    updateGrade(e, subject, studentId){
        let grades = this.state.computedGrades;
        let index = grades.findIndex(e => e.id === studentId);
        grades[index].grades[subject] = e.target.value;
        this.setState({computedGrades: grades});
    }

    async postGrades(event){
        event.preventDefault();
        let notValidGrade = undefined;
        for(var i in this.state.computedGrades){
            notValidGrade = Object.entries(this.state.computedGrades[i].grades).find(grade => grade[1] === '' || isNaN(grade[1]) || grade[1] < 0 || grade[1] >10);
            if(notValidGrade !== undefined){
                break;
            }
        }
        if(notValidGrade !== undefined){
            alert('Please insert a grade in the range [0 - 10] for each subject and for each student.');
        } else {
            //Prepare data here
            let data = [];
            await this.sendDataToBackend(data);
            this.setState({
                enableProcedure: false, //Send request again to db for
                allClasses: this.props.allClasses === undefined ? [] : this.props.allClasses,
                satisfiedRequest: true
            });
        }
    }

    async sendDataToBackend(data){
        //send data to backend here
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
                                <th/><th/><th/><th/>
                            </tr>
                        </thead>
                        <tbody>
                            {Object.entries(s.grades).map(grade =>
                                <tr>
                                    <td><i style={{textDecoration: 'underline'}}>{grade[0]}:</i></td>
                                    <td>
                                    <InputGroup>
                                        <FormControl
                                            placeholder="Grade is an integer value in the range [0 - 10]"
                                            value={grade[1]}
                                            onChange={(e) => this.updateGrade(e, grade[0], s.id)}
                                        />
                                    </InputGroup>
                                    </td>
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
                {this.state.satisfiedRequest === true &&(
                    <Alert variant="success">Grades have been recorded successfully!</Alert>
                )}
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
                {this.state.enableProcedure === true &&
                <div>
                    <Button variant="outline-success" onClick={(event) => this.postGrades(event)}>Upload Grades</Button>
                    <Accordion className="mt-3" defaultActiveKey="0">
                        {studentsDOM.map(student => student)}
                    </Accordion>
                </div>
                }
            </Container>
        );
    }
}