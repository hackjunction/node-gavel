import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Select from 'react-select';
import _ from 'lodash';
import './style.scss';

class DropDownInput extends Component {
    static propTypes = {
        placeholder: PropTypes.string,
        onChange: PropTypes.func.isRequired,
        value: PropTypes.any.isRequired,
        error: PropTypes.string,
        min: PropTypes.number,
        max: PropTypes.number,
        multi: PropTypes.bool,
        options: PropTypes.array
    };

    static defaultProps = {
        min: null,
        max: null,
        multi: false,
        choices: [],
        required: false
    };

    constructor(props) {
        super(props);

        this.state = {
            error: ''
        };

        this.onBlur = this.onBlur.bind(this);
        this.onChange = this.onChange.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        if (this.state.error) {
            this.setState({
                error: this.validate(this.getValue(nextProps))
            });
        }
    }

    getValue(props) {
        if (props.value) return props.value;
        if (props.isMulti) {
            return [];
        } else {
            return '';
        }
    }

    focus() {
        return null;
    }

    validate(value) {
        const { min, max, multi, required } = this.props;

        if (!multi) {
            const val = value || null;
            if (required && !val) {
                return `This field is required.`;
            }
        } else {
            const val = value || [];
            if (min && val.length < min) {
                return `You must choose at least ${min} item(s).`;
            }

            if (max && val.length > max) {
                return `You can't choose over ${max} items.`;
            }
        }

        return null;
    }

    onBlur() {
        this.setState({
            error: this.validate(this.getValue(this.props))
        });
    }

    onChange(data) {
        if (this.props.multi) {
            this.props.onChange(_.map(data, 'value'));
        } else {
            this.props.onChange(data.value);
        }
    }

    getSelectedItems() {
        const value = this.getValue(this.props);
        if (this.props.multi) {
            return _.filter(this.props.choices, choice => {
                return value.indexOf(choice.value) !== -1;
            });
        } else {
            return _.find(this.props.choices, choice => {
                return choice.value === value;
            });
        }
    }

    render() {
        const { choices, multi, hint } = this.props;
        const { error } = this.state;

        return (
            <div className={`DropDownInput ${error ? 'has-error' : ''}`}>
                <div className="DropDownInput_input-wrapper">
                    <Select
                        value={this.getSelectedItems()}
                        onChange={this.onChange}
                        options={choices}
                        isMulti={multi}
                        onBlur={this.onBlur}
                    />
                </div>
                <div className="DropDownInput_under">
                    {this.state.error ? (
                        <div className="DropDownInput_error">
                            <span className="DropDownInput_error-text">{this.state.error}</span>
                        </div>
                    ) : (
                        <span className="DropDownInput_hint">{hint}</span>
                    )}
                </div>
            </div>
        );
    }
}

export default DropDownInput;
