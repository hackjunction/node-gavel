import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import ReactTable from 'react-table';
import './style.scss';

import { TYPES } from '../Form';
import TextInput from '../TextInput';
import LongTextInput from '../LongTextInput';
import DateInput from '../DateInput';
import BooleanInput from '../BooleanInput';
import DropDownInput from '../DropDownInput';
import SubmitButton from '../SubmitButton';

class ArrayInput extends Component {
    static propTypes = {
        fields: PropTypes.arrayOf({
            id: PropTypes.string,
            type: PropTypes.string,
            typeParams: PropTypes.object,
            label: PropTypes.string,
            placeholder: PropTypes.string,
            validate: PropTypes.func
        }),
        value: PropTypes.object,
        onChange: PropTypes.func,
        submitText: PropTypes.string,
        isObject: PropTypes.bool
    };

    constructor(props) {
        super(props);

        this.state = {
            data: this.getDefaultState()
        };

        this.onAdd = this.onAdd.bind(this);
    }

    getDefaultState() {
        return this.props.isObject ? {} : '';
    }

    validate() {
        const { min, max, value } = this.props;

        if (min && value.length < min) {
            return `Must have at least ${min} items`;
        }

        if (max && value.length > max) {
            return `Can't have more than ${max} items`;
        }

        return null;
    }

    validateAdd(newRow) {
        const { fields } = this.props;

        for (let i = 0; i < fields.length; i++) {
            const field = fields[i];

            if (field.options && field.options.required) {
                if (!newRow[field.name]) {
                    return field.label + ' is required';
                }
            }

            if (field.options && field.options.unique) {
                const existing = _.find(this.props.value, row => {
                    return row[field.name] === newRow[field.name];
                });

                if (existing) {
                    return `${field.label} must be unique. You've already added an item with the value ${
                        newRow[field.name]
                    }.`;
                }
            }

            const fieldValidation = this[field.name].validate(newRow[field.name]);

            if (fieldValidation) {
                return field.label + ': ' + fieldValidation;
            }
        }

        return null;
    }

    onAdd() {
        const newRow = this.state.data;
        const validation = this.validateAdd(newRow);
        if (validation) {
            window.alert(validation);
            return null;
        }
        const newData = _.concat(this.props.value, newRow);
        this.props.onChange(newData);
        this.setState({ data: this.getDefaultState() });

        this[this.props.fields[0].name].focus();
    }

    onRemove(index) {
        let newData = JSON.parse(JSON.stringify(this.props.value));
        newData.splice(index, 1);
        this.props.onChange(newData);
    }

    renderFields() {
        const { data } = this.state;

        return _.map(this.props.fields, field => {
            switch (field.type) {
                case TYPES.text.id: {
                    return (
                        <TextInput
                            key={field.id}
                            ref={ref => (this[field.name] = ref)}
                            placeholder={field.placeholder}
                            hint={field.hint}
                            value={data[field.name]}
                            onChange={value => {
                                this.setState({
                                    data: {
                                        ...data,
                                        [field.name]: value
                                    }
                                });
                            }}
                            {...field.options}
                        />
                    );
                }
                case TYPES.textarea.id: {
                    return (
                        <LongTextInput
                            key={field.id}
                            ref={ref => (this[field.name] = ref)}
                            placeholder={field.placeholder}
                            hint={field.hint}
                            value={data[field.name]}
                            onChange={value => {
                                this.setState({
                                    data: {
                                        ...data,
                                        [field.name]: value
                                    }
                                });
                            }}
                            {...field.options}
                        />
                    );
                }
                case TYPES.date.id: {
                    return (
                        <DateInput
                            key={field.id}
                            ref={ref => (this[field.name] = ref)}
                            hint={field.hint}
                            value={data[field.name]}
                            onChange={value => {
                                this.setState({
                                    data: {
                                        ...data,
                                        [field.name]: value
                                    }
                                });
                            }}
                            {...field.options}
                        />
                    );
                }
                case TYPES.boolean.id: {
                    return (
                        <BooleanInput
                            key={field.id}
                            ref={ref => (this[field.name] = ref)}
                            hint={field.hint}
                            value={data[field.name]}
                            onChange={value => {
                                this.setState({
                                    data: {
                                        ...data,
                                        [field.name]: value
                                    }
                                });
                            }}
                            {...field.options}
                        />
                    );
                }
                case TYPES.dropdown.id: {
                    return (
                        <DropDownInput
                            key={field.id}
                            ref={ref => (this[field.name] = ref)}
                            placeholder={field.placeholder}
                            hint={field.hint}
                            value={data[field.name]}
                            onChange={value => {
                                this.setState({
                                    data: {
                                        ...data,
                                        [field.name]: value
                                    }
                                });
                            }}
                            {...field.options}
                        />
                    );
                }
                default:
                    return null;
            }
        });
    }

    renderSubmit() {
        return (
            <div className="ArrayInput--Submit">
                <SubmitButton onClick={this.onAdd} text={this.props.addText} small alignRight />
            </div>
        );
    }

    renderValues() {
        const { value } = this.props;

        if (!Array.isArray(value) || value.length === 0) {
            return null;
        }

        const columns = _.map(this.props.fields, field => {
            return {
                Header: field.label,
                accessor: field.name
            };
        });

        columns.push({
            Header: '',
            id: 'remove',
            Cell: row => (
                <div className="ArrayInput--Remove">
                    <span onClick={() => this.onRemove(row.index)}>Delete</span>
                </div>
            ),
            width: 100,
            sortable: false
        });

        return (
            <div className="ArrayInput--Values">
                <ReactTable
                    data={value}
                    columns={columns}
                    pageSize={value.length}
                    showPagination={false}
                    showPageJump={false}
                    className="-striped -highlight"
                />
            </div>
        );
    }

    render() {
        return (
            <div className="ArrayInput">
                <div className="ArrayInput--Fields">{this.renderFields()}</div>
                {this.renderSubmit()}
                {this.renderValues()}
            </div>
        );
    }
}

export default ArrayInput;
