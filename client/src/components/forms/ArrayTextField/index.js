import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import './style.scss';
import '../style.scss';

class ArrayTextField extends Component {
    static propTypes = {
        label: PropTypes.string,
        placeholder: PropTypes.string,
        values: PropTypes.array,
        onChange: PropTypes.func,
        hint: PropTypes.string,
        validate: PropTypes.func,
        required: PropTypes.bool
    };

    static defaultProps = {
        validate: () => {
            return {
                error: false,
                message: ''
            };
        }
    };

    constructor(props) {
        super(props);

        this.state = {
            error: false,
            message: '',
            inputValue: ''
        };

        this.onAdd = this.onAdd.bind(this);
    }

    isValid() {
        const { maxItems, maxItemsMessage, minItems, minItemsMessage, values, label } = this.props;

        if (maxItems && values.length > maxItems) {
            return {
                error: true,
                message: label + ': ' + maxItemsMessage
            };
        }

        if (minItems && values.length < minItems) {
            return {
                error: true,
                message: label + ': ' + minItemsMessage
            };
        }

        return {
            error: false,
            message: ''
        };
    }

    onAdd(event) {
        const { validateItem, maxItems, maxItemsMessage, unique, uniqueMessage } = this.props;

        if (unique && this.props.values.indexOf(this.state.inputValue) !== -1) {
            this.setState({
                error: true,
                message: uniqueMessage
            });
        } else {
            if (validateItem) {
                const { error, message } = validateItem(this.state.inputValue);

                if (error) {
                    this.setState({
                        error: true,
                        message
                    });
                    return;
                }
            }

            const newValues = _.concat(this.props.values, this.state.inputValue);

            if (maxItems && newValues.length > maxItems) {
                this.setState({
                    error: true,
                    message: maxItemsMessage
                });
            } else {
                this.props.onChange(newValues);
                this.setState({
                    inputValue: '',
                    error: false,
                    message: ''
                });
            }
        }
    }

    onRemove(item) {
        const { minItems, minItemsMessage } = this.props;

        const newValues = _.filter(this.props.values, v => v !== item);

        this.props.onChange(newValues);

        if (minItems && newValues.length < minItems) {
            this.setState({
                error: true,
                message: minItemsMessage
            });
        }
    }

    renderValues() {
        return _.map(this.props.values, (item, index) => {
            return (
                <div className="ArrayTextField--row">
                    <p className="ArrayTextField--item">{item}</p>
                    <button className="ArrayTextField--remove" onClick={() => this.onRemove(item)}>
                        Remove
                    </button>
                </div>
            );
        });
    }

    render() {
        const { error, message, success } = this.state;
        const { required, minItems, maxItems } = this.props;

        const minMaxText = ' (Min: ' + (minItems || 'none') + ', max: ' + (maxItems || 'none') + ')';

        const hintText = this.props.hint ? this.props.hint + minMaxText : minMaxText;

        return (
            <div className={error ? 'FormField has-error' : 'FormField'}>
                <label className={required ? 'FormField--label is-required' : 'FormField--label'}>
                    {this.props.label}
                </label>
                <div className="FormField--content-wrapper">
                    <div className="FormField--input-wrapper">
                        <input
                            ref={ref => (this.input = ref)}
                            className="FormField--input"
                            type="text"
                            placeholder={this.props.placeholder}
                            onChange={event => this.setState({ inputValue: event.target.value })}
                            onBlur={this.onBlur}
                            value={this.state.inputValue}
                        />
                        <div className="ArrayTextField--add-button">
                            <button disabled={!this.state.inputValue} onClick={this.onAdd}>
                                Add
                            </button>
                        </div>
                    </div>
                    <small className="FormField--hint">{hintText}</small>
                    <small className="FormField--error">{message}</small>
                    {this.renderValues()}
                </div>
            </div>
        );
    }
}

export default ArrayTextField;
