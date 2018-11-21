import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import moment from 'moment-timezone';
import './style.scss';

class DateField extends Component {
    render() {
        return (
            <button className="DateField" onClick={this.props.onClick}>
                {this.props.value || 'Select a date & time'}
            </button>
        );
    }
}

class DateInput extends Component {
    static propTypes = {
        placeholder: PropTypes.string,
        onChange: PropTypes.func.isRequired,
        value: PropTypes.string.isRequired,
        error: PropTypes.string,
        minDate: PropTypes.number,
        maxDate: PropTypes.number,
        validate: PropTypes.func
    };

    static defaultProps = {
        minDate: null,
        maxDate: null,
        validate: null
    };

    constructor(props) {
        super(props);

        this.state = {
            error: ''
        };

        this.handleChange = this.handleChange.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            error: this.validate(nextProps.value, nextProps)
        });
    }

    focus() {
        return null;
    }

    validate(value, props = this.props) {
        const { minDate, maxDate } = props;

        const dt = moment(value);
        const minDt = moment(minDate);
        const maxDt = moment(maxDate);

        if (minDate && dt.isBefore(minDt)) {
            return 'Must be after ' + minDt.format('DD.MM.YYYY h:mm a');
        }

        if (maxDate && dt.isAfter(maxDt)) {
            return 'Must be before ' + maxDt.format('DD.MM.YYYY h:mm a');
        }

        return null;
    }

    handleChange(newDate) {
        this.props.onChange(newDate);
    }

    render() {
        const { hint } = this.props;
        const { error } = this.state;
        const value = this.props.value;

        return (
            <div className={`DateInput ${error ? 'has-error' : ''}`}>
                <div className="DateInput_input-wrapper">
                    <DatePicker
                        customInput={<DateField />}
                        selected={value}
                        onChange={this.handleChange}
                        showTimeSelect
                        timeFormat="HH:mm"
                        timeIntervals={15}
                        dateFormat="MMMM d, yyyy h:mm aa"
                        timeCaption="time"
                    />
                </div>
                <div className="DateInput_under">
                    {this.state.error ? (
                        <span className="DateInput_error">{this.state.error}</span>
                    ) : (
                        <span className="DateInput_hint">{hint}</span>
                    )}
                </div>
            </div>
        );
    }
}

export default DateInput;
