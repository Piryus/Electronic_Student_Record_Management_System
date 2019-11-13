import React from 'react';
import Routes from '../routes/routes';

class App extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            authenticated: false,
            role: [], /*to be made dynamic using props because it is inherited from login component*/
        };
        this.setAppProps = this.setAppProps.bind(this)
    }

    setAppProps(authenticated, role) {
        this.setState({
            authenticated,
            role
        });
    }

    render() {
        const authenticated = this.state.authenticated;
        const role = this.state.role;
        const setAppProps = this.setAppProps;
        return (
            <Routes appProps={{authenticated, role, setAppProps}} />
        );
    }
}

export default App;