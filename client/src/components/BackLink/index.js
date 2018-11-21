import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import './style.scss';

class BackLink extends Component {
    static propTypes = {
        text: PropTypes.string.isRequired,
        to: PropTypes.string.isRequired
    };

    render() {
        return (
            <Link className="BackLink" to={this.props.to}>
                <i className="BackLink--arrow fas fa-arrow-left" />
                <span className="BackLink--text">{this.props.text}</span>
            </Link>
        );
    }
}

export default BackLink;
