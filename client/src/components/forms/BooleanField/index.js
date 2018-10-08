import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Switch from 'react-switch';
import './style.scss';
import '../style.scss';

class BooleanField extends Component {
    static propTypes = {
        label: PropTypes.string,
        placeholder: PropTypes.string,
        value: PropTypes.string,
        onChange: PropTypes.func,
        hint: PropTypes.string,
        validate: PropTypes.func
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
            message: ''
        };

        this.onChange = this.onChange.bind(this);
    }

    isValid() {
        return {
            error: false,
            message: ''
        };
    }

    onChange(checked) {
        this.props.onChange(checked);
    }

    render() {
        const { error } = this.state;

        return (
            <div className={error ? 'FormField has-error' : 'FormField'}>
                <label className="FormField--label">{this.props.label}</label>
                <div className="FormField--content-wrapper">
                    <div className="BooleanField--input-wrapper">
                        <p>{this.props.text}</p>
                        <Switch
                            onChange={this.onChange}
                            checked={this.props.value}
                            checkedIcon={false}
                            uncheckedIcon={false}
                            onColor={'#00ff99'}
                            id="normal-switch"
                        />
                    </div>
                    <small className="FormField--hint">{this.props.hint || ''}</small>
                </div>
            </div>
        );
    }
}

export default BooleanField;
