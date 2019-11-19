import React from 'react';
import Routes from '../routes/routes';

class App extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            authenticated: false,
            role: [],
            extra: {}
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
                console.log(response);
                this.setState({
                    authenticated: true,
                    role: response.role,
                    extra: response.extra
                });
            }
        });
    }

    setAppProps(authenticated, role, extra) {
        this.setState({
            authenticated,
            role,
            extra
        });
    }

    render() {
        const authenticated = this.state.authenticated;
        const role = this.state.role;
        const extra = this.state.extra;
        const setAppProps = this.setAppProps;
        return (
            <Routes appProps={{authenticated, role, extra, setAppProps}}/>
        );
    }
}

export default App;