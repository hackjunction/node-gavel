import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import './style.scss';

import FormField from '../FormField';
import TextInput from '../TextInput';
import LongTextInput from '../LongTextInput';
import DropDownInput from '../DropDownInput';
import BooleanInput from '../BooleanInput';
import DateInput from '../DateInput';
import SubmitButton from '../SubmitButton';
import ArrayInput from '../ArrayInput';

export const TYPES = {
    text: {
        id: 'text',
        options: ['min', 'max']
    },
    textarea: {
        id: 'textarea',
        options: ['min', 'max']
    },
    date: {
        id: 'date',
        options: ['minDate', 'maxDate']
    },
    dropdown: {
        id: 'dropdown',
        options: ['multi', 'choices', 'min', 'max']
    },
    boolean: {
        id: 'boolean',
        options: ['default']
    },
    array: {
        id: 'array',
        options: ['fields', 'isObject']
    }
};

class Form extends Component {
    static propTypes = {
        fields: PropTypes.arrayOf({
            id: PropTypes.string,
            type: PropTypes.string,
            typeParams: PropTypes.object,
            label: PropTypes.string,
            placeholder: PropTypes.string,
            validate: PropTypes.func
        }),
        data: PropTypes.object,
        onChange: PropTypes.func,
        disableSubmit: PropTypes.bool,
        loading: PropTypes.loading,
        submitText: PropTypes.string
    };

    constructor(props) {
        super(props);

        this.state = {
            formErrors: []
        };

        this.attemptSubmit = this.attemptSubmit.bind(this);
    }

    onChange(field, value) {
        this.props.onChange({
            ...this.props.data,
            [field]: value
        });
    }

    canSubmit() {
        let checkboxesChecked = true;

        if (!Array.isArray(this.props.checkboxes) || this.props.checkboxes.length === 0) {
            return true;
        }

        _.each(this.props.checkboxes, cb => {
            const value = this.state['checkbox-' + cb.id];

            if (typeof value === 'undefined') {
                if (!cb.defaultValue) {
                    checkboxesChecked = false;
                }
            } else if (!value) {
                checkboxesChecked = false;
            }
        });

        if (!checkboxesChecked) {
            return false;
        }

        return true;
    }

    attemptSubmit() {
        const errors = [];
        _.each(this.props.fields, field => {
            const error = this[field.name].validate(this.props.data[field.name]);

            if (error) {
                errors.push({
                    field: field.label,
                    error
                });
            }
        });

        if (errors.length > 0) {
            this.setState({
                formErrors: errors
            });
        } else {
            this.setState({
                formErrors: []
            });
            this.props.onSubmit();
        }
    }

    renderFields() {
        const { fields, data } = this.props;

        return _.map(fields, field => {
            switch (field.type) {
                case TYPES.text.id: {
                    return (
                        <FormField key={field.id} id={field.id} label={field.label} required={field.required}>
                            <TextInput
                                ref={ref => (this[field.name] = ref)}
                                placeholder={field.placeholder}
                                hint={field.hint}
                                value={data[field.name]}
                                onChange={value => {
                                    this.onChange(field.name, value);
                                }}
                                {...field.options}
                            />
                        </FormField>
                    );
                }
                case TYPES.textarea.id: {
                    return (
                        <FormField key={field.id} id={field.id} label={field.label} required={field.required}>
                            <LongTextInput
                                ref={ref => (this[field.name] = ref)}
                                placeholder={field.placeholder}
                                hint={field.hint}
                                value={data[field.name]}
                                onChange={value => {
                                    this.onChange(field.name, value);
                                }}
                                {...field.options}
                            />
                        </FormField>
                    );
                }
                case TYPES.date.id: {
                    return (
                        <FormField key={field.id} id={field.id} label={field.label} required={field.required}>
                            <DateInput
                                ref={ref => (this[field.name] = ref)}
                                hint={field.hint}
                                value={data[field.name]}
                                onChange={value => {
                                    this.onChange(field.name, value);
                                }}
                                {...field.options}
                            />
                        </FormField>
                    );
                }
                case TYPES.boolean.id: {
                    return (
                        <FormField key={field.id} id={field.id} label={field.label}>
                            <BooleanInput
                                ref={ref => (this[field.name] = ref)}
                                hint={field.hint}
                                value={data[field.name]}
                                onChange={value => {
                                    this.onChange(field.name, value);
                                }}
                                {...field.options}
                            />
                        </FormField>
                    );
                }
                case TYPES.dropdown.id: {
                    return (
                        <FormField key={field.id} id={field.id} label={field.label} required={field.required}>
                            <DropDownInput
                                ref={ref => (this[field.name] = ref)}
                                placeholder={field.placeholder}
                                hint={field.hint}
                                value={data[field.name]}
                                onChange={value => {
                                    this.onChange(field.name, value);
                                }}
                                {...field.options}
                            />
                        </FormField>
                    );
                }
                case TYPES.array.id: {
                    return (
                        <FormField key={field.id} id={field.id} label={field.label} required={field.required}>
                            <ArrayInput
                                ref={ref => (this[field.name] = ref)}
                                value={data[field.name]}
                                onChange={value => {
                                    this.onChange(field.name, value);
                                }}
                                {...field.options}
                            />
                        </FormField>
                    );
                }
                default: {
                    throw new Error('Invalid field type ' + field.type);
                }
            }
        });
    }

    renderCheckboxes() {
        if (!Array.isArray(this.props.checkboxes) || this.props.checkboxes.length === 0) {
            return null;
        }

        const checkboxes = _.map(this.props.checkboxes, cb => {
            const id = 'checkbox-' + cb.id;
            return (
                <div className="Form--Checkbox">
                    <div className="Form--Checkbox_check">
                        <input
                            type="checkbox"
                            defaultChecked={cb.defaultValue || false}
                            value={this.state[id]}
                            onChange={e =>
                                this.setState({
                                    [id]: e.target.checked
                                })
                            }
                        />
                    </div>
                    <div className="Form--Checkbox_text">{cb.render()}</div>
                </div>
            );
        });

        return <div className="Form--Checkboxes">{checkboxes}</div>;
    }

    renderErrors() {
        if (!Array.isArray(this.state.formErrors) || this.state.formErrors.length === 0) {
            return null;
        }

        const errors = _.map(this.state.formErrors, ({ field, error }) => {
            return (
                <li className="Form--Errors_item">
                    <p className="Form--Errors_error">
                        <strong>{field}: </strong>
                        {error}
                    </p>
                </li>
            );
        });

        return (
            <div className="Form--Errors">
                <p className="Form--Errors_title">Please check the following fields</p>
                <ul className="Form--Errors">{errors}</ul>
            </div>
        );
    }

    renderSubmit() {
        const { disableSubmit, loading, submitText } = this.props;
        return (
            <div className="Form--Submit">
                <SubmitButton
                    disabled={!this.canSubmit() || disableSubmit}
                    loading={loading}
                    text={submitText}
                    onClick={this.attemptSubmit}
                />
            </div>
        );
    }

    render() {
        return (
            <div className="Form">
                <div className="Form--Fields">{this.renderFields()}</div>
                {this.renderCheckboxes()}
                {this.renderErrors()}
                {this.renderSubmit()}
            </div>
        );
    }
}

export default Form;
