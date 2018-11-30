import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './style.scss';

class NotFound extends Component {

    static propTypes = {
        title: PropTypes.string,
        body: PropTypes.string,
    };

    static defaultProps = {
        title: "There's nothing here",
        body: "Looks like the page you were looking for doesn't exist",
        link: "/",
        linkText: "Front page"
    }

    render() {
        return (
            <div className="NotFound">
                <h1 className="NotFound--title">{this.props.title}</h1>
                <p className="NotFound--body">{this.props.body}</p>
                <a href={this.props.link}>{this.props.linkText}</a>
            </div>
        );
    }
}

export default NotFound;
