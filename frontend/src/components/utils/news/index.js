import React from 'react';
import {Button, Container} from "react-bootstrap";
import {FaCalendar} from 'react-icons/fa';
import NewArticleModal from "./new-article-modal/new-article-modal";
import SectionHeader from "../section-header";
import LoadingSpinner from "../loading-spinner";

export default class News extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            articles: [],
            showNewArticleModal: false,
            loading: true,
        };
    }

    async componentDidMount() {
        const articles = await this.fetchArticles();
        if (articles !== null) {
            this.setState({articles, loading: false});
        }
    }

    async fetchArticles() {
        const url = 'http://localhost:3000/articles';
        const options = {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            credentials: 'include'
        };
        const response = await fetch(url, options);
        const responseJson = await response.json();
        return responseJson.articles;
    }

    render() {
        return (
            <Container fluid className="mt-2">
                <SectionHeader>News</SectionHeader>
                {this.state.loading && <LoadingSpinner/>}
                {!this.state.loading &&
                <>
                    {this.props.isOfficer &&
                    <Button onClick={() => this.setState({showNewArticleModal: true})} className="mb-2">Write an
                        article</Button>}
                    <NewArticleModal show={this.state.showNewArticleModal}
                                     handleClose={async () => {
                                         const articles = await this.fetchArticles();
                                         this.setState({
                                             articles, 
                                             showNewArticleModal: false
                                         });
                                     }}/>
                    {this.state.articles.map(article => {
                        return (
                            <div className="mb-4" key={article._id}>
                                <h5>{article.title}</h5>
                                <span className="font-italic"><FaCalendar size={14}
                                                                          className="align-baseline mr-2"/>{new Date(article.date).longString()} - by&nbsp;
                                    {article.authorId ? [article.authorId.name, article.authorId.surname].join(' ') : 'Administrative Office'}
                            </span>
                                <p className="text-justify">{article.content}</p>
                            </div>)
                    })}
                </>}
            </Container>
        );
    }
}