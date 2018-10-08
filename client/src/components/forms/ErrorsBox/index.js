import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import './style.scss';

class ErrorsBox extends Component {
    static propTypes = {
        errors: PropTypes.array
    };

    render() {
        if (!Array.isArray(this.props.errors) || this.props.errors.length === 0) {
            return null;
        }
        const errors = _.map(this.props.errors, e => {
            return (
                <div className="ErrorsBox--error">
                    <p className="ErrorsBox--error-message">{e.message}</p>
                </div>
            );
        });

        return (
            <div className="ErrorsBox">
                <h5 className="ErrorsBox--title">
                    <i class="fas fa-exclamation-circle" />
                    Please check the following fields:
                </h5>
                {errors}
            </div>
        );
    }
}

export default ErrorsBox;
