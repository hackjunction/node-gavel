import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './style.scss';
import '../style.scss';

class SectionWrapper extends Component {
    static propTypes = {
        label: PropTypes.string,
        children: PropTypes.any,
        hasError: PropTypes.bool
    };

    render() {
        return (
            <div className={this.props.hasError ? 'FormField has-error' : 'FormField'}>
                <label className="FormField--label">{this.props.label}</label>
                <div className="FormField--content-wrapper">{this.props.children}</div>
            </div>
        );
    }
}

export default SectionWrapper;
