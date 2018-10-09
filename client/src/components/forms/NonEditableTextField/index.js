import React, { Component } from 'react';
import PropTypes from 'prop-types';
import '../style.scss';

class NonEditableTextField extends Component {
    static propTypes = {
        label: PropTypes.string,
        value: PropTypes.string,
        onClear: PropTypes.func
    };

    render() {
        return (
            <div className="FormField">
                <label className="FormField--label">{this.props.label}</label>
                <div className="FormField--content-wrapper">
                    <div className="FormField--input-wrapper">
                        <p className="FormField--non-editable">{this.props.value}</p>
                        <div className="FormField--clear">
                            <i className="fas fa-trash-alt" onClick={this.props.onClear} />
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default NonEditableTextField;
