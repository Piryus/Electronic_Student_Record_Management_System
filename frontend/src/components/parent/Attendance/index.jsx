import React from 'react';
import MyTimetable from '../../utils/MyTimetable';
import SectionHeader from "../../utils/section-header";
import {Container} from "react-bootstrap";

const absent = "Absent";
const empty = "";
const earlyExit = "Left early";
const lateEntrance = "Arrived late";
const lateAndEarly = <span>Late Entry <br/> Early Exit</span>;
var tmp2 = ["a", "b", "c", "d", "e", "f",];
var tmp3 = [
    {
        date: "",
        content: [
            {
                text: "",
                color: ""
            },
            {
                text: "",
                color: ""
            },
            {
                text: "",
                color: ""
            },
            {
                text: "",
                color: ""
            },
            {
                text: "",
                color: ""
            },
            {
                text: "",
                color: ""
            },
        ]
    },
    {
        date: "",
        content: [
            {
                text: "",
                color: ""
            },
            {
                text: "",
                color: ""
            },
            {
                text: "",
                color: ""
            },
            {
                text: "",
                color: ""
            },
            {
                text: "",
                color: ""
            },
            {
                text: "",
                color: ""
            },
        ]
    },
    {
        date: "",
        content: [
            {
                text: "",
                color: ""
            },
            {
                text: "",
                color: ""
            },
            {
                text: "",
                color: ""
            },
            {
                text: "",
                color: ""
            },
            {
                text: "",
                color: ""
            },
            {
                text: "",
                color: ""
            },
        ]
    },
    {
        date: "",
        content: [
            {
                text: "",
                color: ""
            },
            {
                text: "",
                color: ""
            },
            {
                text: "",
                color: ""
            },
            {
                text: "",
                color: ""
            },
            {
                text: "",
                color: ""
            },
            {
                text: "",
                color: ""
            },
        ]
    },
    {
        date: "",
        content: [
            {
                text: "",
                color: ""
            },
            {
                text: "",
                color: ""
            },
            {
                text: "",
                color: ""
            },
            {
                text: "",
                color: ""
            },
            {
                text: "",
                color: ""
            },
            {
                text: "",
                color: ""
            },
        ]

    }
];
const tmp = [
    {
        date: "25/11/2019",
        enter: 1,
        exit: 5,
        event: {
            absent: false,
            lateEntrance: false,
            earlyExit: true,
        },

    },
    {
        date: "26/11/2019",
        enter: 1,
        exit: 4,
        event: {
            absent: false,
            lateEntrance: false,
            earlyExit: false,
        },

    },
    {
        date: "27/11/2019",
        enter: 1,
        exit: 6,
        event: {
            absent: true,
            lateEntrance: false,
            earlyExit: false,
        },

    },
    {
        date: "28/11/2019",
        enter: 1,
        exit: 5,
        event: {
            absent: false,
            lateEntrance: true,
            earlyExit: false,
        },

    },
    {
        date: "29/11/2019",
        enter: 1,
        exit: 5,
        event: {
            absent: false,
            lateEntrance: false,
            earlyExit: false,
        },

    },
];

export default class Attendance extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            childAttendance: [],
        }
    }

    // Get first monday of the week based on passed date
    startOfWeek = (date) => {
        const diff = date.getDate() - date.getDay() + (date.getDay() === 0 ? -6 : 1);
        return new Date(date.setDate(diff));
    };

    async componentDidMount() {
        await this.getChildAttendance();
    }

    async componentDidUpdate(prevProps, prevState, snapshot) {
        await this.getChildAttendance();
    }

    async getChildAttendance() {
        // Query child's attendance
        const url = 'http://localhost:3000/attendance/' + this.props.child._id;
        const options = {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            credentials: 'include',
        };
        const response = await fetch(url, options);
        const json = await response.json();
        if (this.state.childAttendance !== json.attendance) {
            this.setState({
                childAttendance: json.attendance
            });
        }
    }

    render() {
        console.log(this.state.childAttendance);
        // //Handle data from backend
        // let store = this.state.childAssignment || tmp;
        // const now = new Date();
        // const sw = this.startOfWeek(now);//for weekly query

        // Basic data construction
        let data = [];
        for (let dayIndex = 0; dayIndex < 5; dayIndex++) {
            let dateObject = {};
            dateObject.date = new Date(this.startOfWeek(new Date())); // TODO Use hlib
            dateObject.date.setDate(dateObject.date.getDate() + dayIndex);
            let content = [];
            for (let hourIndex = 0; hourIndex < 6; hourIndex++) {
                content.push({
                    text: '',
                    color: 'bg-success text-white'
                });
            }
            dateObject.content = content;
            data.push(dateObject);
        }

        this.state.childAttendance.forEach((event, index) => {
            const eventDate = new Date(event.date);
            data.forEach(day => {
                if (eventDate.getDate() === day.date.getDate() &&
                    eventDate.getMonth() === day.date.getMonth() &&
                    eventDate.getFullYear() === day.date.getFullYear()) {
                    if (event.event === 'absence') {
                        day.content.forEach((hour => {
                            hour.color = 'bg-danger text-white';
                            hour.text = 'Absent';
                        }))
                    } else if (event.event === 'late-entry') {
                      // TODO Manage this case
                    } else if (event.event === 'early-exit') {
                      // TODO Manage this case
                    }
                }
            });
        });

        return (
            <Container fluid>
                <SectionHeader>Attendance</SectionHeader>
                {/*{this.state.childAttendance.map((event, index) => {*/}
                {/*    {*/}
                {/*        tmp2.map((it, i) => {*/}
                {/*            if (item.event.absent) {*/}
                {/*                tmp3[index].content[i].color = 'bg-danger text-white';*/}
                {/*                tmp3[index].content[i].text = absent;*/}
                {/*            } else if (item.event.lateEntrance && i == item.enter - 1) {*/}
                {/*                tmp3[index].content[i].color = 'bg-warning text-white';*/}
                {/*                tmp3[index].content[i].text = lateEntrance;*/}
                {/*            } else if (item.event.earlyExit && i == item.exit - 1) {*/}
                {/*                tmp3[index].content[i].color = 'bg-warning';*/}
                {/*                tmp3[index].content[i].text = earlyExit;*/}
                {/*            } else if (i >= item.enter - 1 && i <= item.exit - 1) {*/}
                {/*                tmp3[index].content[i].color = 'bg-success text-white';*/}
                {/*                tmp3[index].content[i].text = empty;*/}
                {/*            } else {*/}
                {/*                tmp3[index].content[i].color = 'bg-secondary';*/}
                {/*                tmp3[index].content[i].text = empty;*/}
                {/*            }*/}
                {/*        })*/}
                {/*    }*/}
                {/*})}*/}
                <MyTimetable data={data}/>
            </Container>
        );
    }
}