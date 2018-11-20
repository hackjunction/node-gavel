import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Select from 'react-select';
import './style.scss';

class DropDownInput extends Component {
    static propTypes = {
        placeholder: PropTypes.string,
        onChange: PropTypes.func.isRequired,
        value: PropTypes.string.isRequired,
        error: PropTypes.string,
        min: PropTypes.number,
        max: PropTypes.number,
        multi: PropTypes.bool,
        options: PropTypes.array
    };

    constructor(props) {
        super(props);

        this.state = {
            error: ''
        };

        this.onBlur = this.onBlur.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        if (this.state.error) {
            this.setState({
                error: this.validate(nextProps.value)
            });
        }
    }

    validate(value = '') {
        const { min, max } = this.props;

        if (min && value.length < min) {
            return `Must be at least ${min} characters.`;
        }

        if (max && value.length > max) {
            return `Cannot be over ${max} characters.`;
        }

        return null;
    }

    charCount(curr) {
        const { min, max } = this.props;
        if (min && max) {
            return curr + '/' + min + '-' + max;
        } else if (min) {
            return curr + '/' + min + '-';
        } else if (max) {
            return curr + '/' + max;
        } else {
            return null;
        }
    }

    onBlur() {
        this.setState({
            error: this.validate(this.props.value)
        });
    }

    onChange() {
        return null;
    }

    render() {
        const { choices, multi, hint } = this.props;
        const { error } = this.state;
        const value = this.props.value || '';

        return (
            <div className={`DropDownInput ${error ? 'has-error' : ''}`}>
                <div className="DropDownInput_input-wrapper">
                    <Select value={value} onChange={this.onChange} options={choices} multi={multi} />
                    <div className="DropDownInput_error">
                        <i className="fas fa-times" />
                    </div>
                </div>
                <div className="DropDownInput_under">
                    <span className="DropDownInput_hint">{hint}</span>
                </div>
            </div>
        );
    }
}

export default DropDownInput;
