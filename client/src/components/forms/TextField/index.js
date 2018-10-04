import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './style.scss';
import '../style.scss';

class TextField extends Component {
    static propTypes = {
        label: PropTypes.string,
        placeholder: PropTypes.string,
        value: PropTypes.string,
        onChange: PropTypes.func,
		hint: PropTypes.string,
		validate: PropTypes.func,
	};

	static defaultProps = {
		validate: () => {
			return {
				error: false, 
				message: ''
			}
		},
	}

	constructor(props) {
		super(props);

		this.state = {
			error: false,
			message: '',
		}

		this.onBlur = this.onBlur.bind(this);
		this.onChange = this.onChange.bind(this);
	}

	onBlur() {
		const {error, message, success} = this.props.validate(this.props.value);

		if (error) {
			this.setState({
				success: false,
				error,
				message
			});
		} else {
			this.setState({
				success: true,
				error: false, 
				message,
			});
		}
	}

	onChange(event) {

		if (this.state.error) {
			const {error, message} = this.props.validate(event.target.value);

			if (!error) {
				this.setState({
					error: false,
					message: ''
				})
			}
		}

		this.props.onChange(event.target.value);
	}

    render() {
		const {error, message, success} = this.state;

        return (
            <div className={error ? 'FormField has-error' : 'FormField'}>
                <label className="FormField--label">{this.props.label}</label>
                <div className="FormField--content-wrapper">
					<div className={success ? 'FormField--input-wrapper has-success' : 'FormField--input-wrapper'}>
						<input className="FormField--input" type="text" placeholder={this.props.placeholder} onChange={this.onChange} onBlur={this.onBlur}/>
						<div className="FormField--success">
							<span className="FormField--success-msg">{message}</span>
							<i className={"FormField--check far fa-check-circle"}></i>
						</div>
					</div>
                    <small className="FormField--hint">{this.props.hint || ''}</small>
					<small className="FormField--error">{message}</small>
                </div>
            </div>
        );
    }
}

export default TextField;
