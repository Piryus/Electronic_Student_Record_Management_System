import React from 'react';
import Routes from '../routes/routes';

class App extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            authenticated: false,
            role: [],
            children: []
        };
        this.setAppProps = this.setAppProps.bind(this)
    }

    async checkAuth() {
        const url = 'http://localhost:3000/auth/check';
        const options = {
            method: 'GET',
            credentials: 'include'
        };
        let response = await fetch(url, options);
        return response.json();
    }

    componentDidMount() {
        this.checkAuth().then((response) => {
            if (response.isAuth) {
                this.setState({
                    authenticated: true,
                    role: response.role,
                    children: response.children
                });
            }
        });
    }

    setAppProps(authenticated, role, children) {
        this.setState({
            authenticated,
            role,
            children
        });
    }

    render() {
        const authenticated = this.state.authenticated;
        const role = this.state.role;
        const children = this.state.children;
        const setAppProps = this.setAppProps;
        return (
            <Routes appProps={{authenticated, role, children, setAppProps}}/>
        );
    }
}

export default App;