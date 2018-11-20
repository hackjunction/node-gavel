import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './style.scss';
import '../style.scss';

class FormField extends Component {
    static propTypes = {
        label: PropTypes.string,
        children: PropTypes.any,
        hasError: PropTypes.bool
    };

    render() {
        const { children, label, hasError } = this.props;

        return (
            <div className={hasError ? 'FormField has-error' : 'FormField'}>
                <label className="FormField--label">{label}</label>
                <div className="FormField--content-wrapper">{children}</div>
            </div>
        );
    }
}

export default FormField;
