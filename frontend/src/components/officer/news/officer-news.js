import React from 'react';
import {Button, Container} from "react-bootstrap";
import {FaCalendar} from 'react-icons/fa';
import NewArticleModal from "./new-article-modal/new-article-modal";

export default class News extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            news: [],
            showNewArticleModal: false
        };
    }

    fetchNews() {
        // TODO Fetch news from backend
    }

    render() {
        return (
            <Container fluid className="mt-2">
                <h2>News</h2>
                <hr/>
                <Button onClick={() => this.setState({showNewArticleModal: true})} className="mb-2">Write an article</Button>
                <NewArticleModal show={this.state.showNewArticleModal} handleClose={() => this.setState({showNewArticleModal: false})}/>
                <div className="mb-4">
                    <h5>Lorem ipsum</h5>
                    <span className="font-italic"><FaCalendar size={14} className="align-baseline mr-2"/>Nov. 22, 2019 11:09 - by Emile Legendre</span>
                    <p className="text-justify">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
                        tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
                        exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in
                        reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint
                        occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est
                        laborum.</p>
                </div>
                <div className="mb-4">
                    <h5>Lorem ipsum 2</h5>
                    <span className="font-italic"><FaCalendar size={14} className="align-baseline mr-2"/>Nov. 22, 2019 11:25 - by Emile Legendre</span>
                    <p className="text-justify">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
                        tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
                        exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in
                        reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint
                        occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est
                        laborum.</p>
                </div>
                <div className="mb-4">
                    <h5>Lorem ipsum 3</h5>
                    <span className="font-italic"><FaCalendar size={14} className="align-baseline mr-2"/>Nov. 22, 2019 11;47 - by Emile Legendre</span>
                    <p className="text-justify">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
                        tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
                        exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in
                        reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint
                        occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est
                        laborum.</p>
                </div>
            </Container>
        );
    }
}