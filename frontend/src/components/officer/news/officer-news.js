import React from 'react';
import {Button, Container} from "react-bootstrap";
import {FaCalendar} from 'react-icons/fa';
import NewArticleModal from "./new-article-modal/new-article-modal";

export default class News extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            articles: [],
            showNewArticleModal: false
        };
    }

    async componentDidMount() {
        await this.fetchArticles();
    }

    async fetchArticles() {
        const url = 'http://localhost:3000/articles/all';
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
        this.setState({
            articles: responseJson,
        });
    }

    render() {
        return (
            <Container fluid className="mt-2">
                <h2>News</h2>
                <hr/>
                <Button onClick={() => this.setState({showNewArticleModal: true})} className="mb-2">Write an
                    article</Button>
                <NewArticleModal show={this.state.showNewArticleModal}
                                 handleClose={() => this.setState({showNewArticleModal: false})}/>
                {this.state.articles.map(article => {
                    return (
                        <div className="mb-4" key={article.id}>
                            <h5>{article.title}</h5>
                            <span className="font-italic"><FaCalendar size={14}
                                                                      className="align-baseline mr-2"/>{article.date} - by {article.author}</span>
                            <p className="text-justify">{article.content}</p>
                        </div>)
                })}
            </Container>
        );
    }
}