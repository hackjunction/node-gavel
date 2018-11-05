import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import Select from 'react-select';
import './style.scss';
import '../style.scss';

class DropDown extends Component {
    static propTypes = {
        label: PropTypes.string,
        placeholder: PropTypes.string,
        value: PropTypes.string,
        onChange: PropTypes.func,
        hint: PropTypes.string,
        validate: PropTypes.func,
        required: PropTypes.bool,
        options: PropTypes.array.isRequired,
        isMulti: PropTypes.bool
    };

    static defaultProps = {
        validate: () => {
            return {
                error: false,
                message: ''
            };
        },
        isMulti: false
    };

    constructor(props) {
        super(props);

        this.state = {
            error: false,
            message: '',
            active: false
        };

        this.onChange = this.onChange.bind(this);
    }

    isValid() {
        const { error, message } = this.props.validate(this.props.value);

        return {
            error,
            message: this.props.label + ': ' + message
        };
    }

    onChange(data) {
        let value;
        if (this.props.isMulti) {
            value = _.map(data, 'value');
            if (this.props.required && value.length === 0) {
                this.setState({
                    error: true,
                    message: 'This field is required'
                });
            } else {
                this.setState({
                    error: false,
                    message: ''
                });
            }
        } else {
            value = data ? data.value : '';
            if (this.props.required && data.length === 0) {
                this.setState({
                    error: true,
                    message: 'This field is required'
                });
            } else {
                this.setState({
                    error: false,
                    message: ''
                });
            }
        }

        this.props.onChange(value);
    }

    render() {
        const { error, message, success } = this.state;
        const { required } = this.props;

        const options = _.map(this.props.options, o => {
            return {
                label: o,
                value: o
            };
        });

        let value;

        if (this.props.isMulti) {
            value = this.props.value
                ? _.map(this.props.value, v => {
                      return {
                          value: v,
                          label: v
                      };
                  })
                : [];
        } else {
            value = this.props.value ? { label: this.props.value, value: this.props.value } : null;
        }

        return (
            <div className={error ? 'FormField has-error' : 'FormField'}>
                <label className={required ? 'FormField--label is-required' : 'FormField--label'}>
                    {this.props.label}
                </label>
                <div className="FormField--content-wrapper">
                    <Select value={value} onChange={this.onChange} options={options} isMulti={this.props.isMulti} />
                    <small className="FormField--hint">{this.props.hint || ''}</small>
                    <small className="FormField--error">{message}</small>
                </div>
            </div>
        );
    }
}

export default DropDown;
