import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import './style.scss';

class BackLink extends Component {
    static propTypes = {
        text: PropTypes.string.isRequired,
        to: PropTypes.string.isRequired,
        hideTextMobile: PropTypes.bool,
    };

    static defaultProps = {
        hideTextMobile: true,
    }

    render() {
        const { hideTextMobile } = this.props;

        return (
            <Link className={`BackLink ${hideTextMobile ? 'hide-text-mobile' : ''}`} to={this.props.to}>
                <i className="BackLink--arrow fas fa-arrow-left" />
                <span className="BackLink--text">{this.props.text}</span>
            </Link>
        );
    }
}

export default BackLink;
