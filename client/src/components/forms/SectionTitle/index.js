import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './style.scss';

class SectionTitle extends Component {

	static propTypes = {
		title: PropTypes.string,
		showLoading: PropTypes.bool,
	}

	render() {
		return (
			<div className="Form--section-title">
				<h3>{this.props.title}</h3>
				{this.props.showLoading ? <i className="fas fa-spinner fa-spin"></i> : null}
			</div>
		);
	}
}

export default SectionTitle;