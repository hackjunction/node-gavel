import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Switch from 'react-switch';
import './style.scss';

class BooleanInput extends Component {
    static propTypes = {
        placeholder: PropTypes.string,
        onChange: PropTypes.func.isRequired,
        value: PropTypes.string.isRequired,
        error: PropTypes.string,
        default: PropTypes.bool,
        validate: PropTypes.func
    };

    static defaultProps = {
        default: null
    };

    focus() {
        return null;
    }

    validate() {
        return null;
    }

    componentWillReceiveProps(nextProps) {
        if (typeof nextProps.value === 'undefined') {
            this.props.onChange(this.getValue());
        }
    }

    getValue() {
        return typeof this.props.value === 'undefined' ? this.props.default : this.props.value;
    }

    render() {
        const { hint, onChange } = this.props;

        return (
            <div className="BooleanInput">
                <p className="BooleanInput--Hint">{hint}</p>
                <Switch
                    onChange={onChange}
                    checked={this.getValue()}
                    checkedIcon={false}
                    uncheckedIcon={false}
                    height={20}
                    width={40}
                    onColor={'#00ff99'}
                    offColor={'#cc0000'}
                />
            </div>
        );
    }
}

export default BooleanInput;
