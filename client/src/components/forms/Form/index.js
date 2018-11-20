import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

import FormField from '../FormField';
import TextInput from '../TextInput';
import LongTextInput from '../LongTextInput';
import DropDownInput from '../DropDownInput';

const TYPES = {
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
        options: ['min', 'max']
    },
    dropdown: {
        id: 'dropdown',
        options: ['multi', 'choices', 'min', 'max']
    }
};

class Form extends Component {
    static propTypes = {
        fields: PropTypes.arrayOf({
            id: PropTypes.string,
            type: PropTypes.oneOf(['text', 'textarea', 'date', 'dropdown']),
            typeParams: PropTypes.object,
            label: PropTypes.string,
            placeholder: PropTypes.string,
            validate: PropTypes.func
        }),
        data: PropTypes.object,
        onChange: PropTypes.func
    };

    onChange(field, value) {
        this.props.onChange({
            ...this.props.data,
            [field]: value
        });
    }

    renderFields() {
        const { fields, data } = this.props;

        return _.map(fields, field => {
            switch (field.type) {
                case TYPES.text.id: {
                    return (
                        <FormField id={field.id} label={field.label} required={field.required}>
                            <TextInput
                                placeholder={field.placeholder}
                                hint={field.hint}
                                value={data[field.name]}
                                onChange={value => {
                                    this.onChange(field.name, value);
                                }}
                                min={field.options && field.options.hasOwnProperty('min') ? field.options.min : null}
                                max={field.options && field.options.hasOwnProperty('max') ? field.options.max : null}
                            />
                        </FormField>
                    );
                }
                case TYPES.textarea.id: {
                    return (
                        <FormField id={field.id} label={field.label} required={field.required}>
                            <LongTextInput
                                placeholder={field.placeholder}
                                hint={field.hint}
                                value={data[field.name]}
                                onChange={value => {
                                    this.onChange(field.name, value);
                                }}
                                min={field.options && field.options.hasOwnProperty('min') ? field.options.min : null}
                                max={field.options && field.options.hasOwnProperty('max') ? field.options.max : null}
                            />
                        </FormField>
                    );
                }
                case TYPES.date.id: {
                    return (
                        <FormField id={field.id} label={field.label} required={field.required}>
                            <p>Date field</p>
                        </FormField>
                    );
                }
                case TYPES.dropdown.id: {
                    return (
                        <FormField id={field.id} label={field.label} required={field.required}>
                            <DropDownInput
                                placeholder={field.placeholder}
                                hint={field.hint}
                                value={data[field.name]}
                                onChange={value => {
                                    this.onChange(field.name, value);
                                }}
                                min={field.options && field.options.hasOwnProperty('min') ? field.options.min : null}
                                max={field.options && field.options.hasOwnProperty('max') ? field.options.max : null}
                                multi={
                                    field.options && field.options.hasOwnProperty('multi') ? field.options.multi : false
                                }
                                choices={
                                    field.options && field.options.hasOwnProperty('choices')
                                        ? field.options.choices
                                        : []
                                }
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

    render() {
        return <div className="Form">{this.renderFields()}</div>;
    }
}

export default Form;
