import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './style.scss';

class LongTextInput extends Component {
    static propTypes = {
        placeholder: PropTypes.string,
        onChange: PropTypes.func.isRequired,
        value: PropTypes.string.isRequired,
        error: PropTypes.string,
        min: PropTypes.number,
        max: PropTypes.number
    };

    static defaultProps = {
        min: null,
        max: null,
        validate: null,
        showErrorText: false,
        required: false
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

    focus() {
        this.input.focus();
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

    render() {
        const { placeholder, hint } = this.props;
        const { error } = this.state;
        const value = this.props.value || '';

        return (
            <div className={`LongTextInput ${error ? 'has-error' : ''}`}>
                <div className="LongTextInput_input-wrapper">
                    <textarea
                        ref={ref => (this.input = ref)}
                        className="LongTextInput_input"
                        type="text"
                        value={value}
                        placeholder={placeholder}
                        onChange={e => this.props.onChange(e.target.value)}
                        onBlur={this.onBlur}
                    />
                    <div className="LongTextInput_error">
                        <i className="fas fa-times" />
                    </div>
                </div>
                <div className="LongTextInput_under">
                    <span className="LongTextInput_hint">{hint}</span>
                    <div className="LongTextInput_character-count">
                        <span className="LongTextInput_character-count-value">{this.charCount(value.length)}</span>
                    </div>
                </div>
            </div>
        );
    }
}

export default LongTextInput;
