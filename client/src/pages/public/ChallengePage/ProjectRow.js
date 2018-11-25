import React, { Component } from 'react';
import PropTypes from 'prop-types';

class ProjectRow extends Component {

	constructor(props) {
		super(props);

		this.state = {
			expanded: false
		}
	}

	render() {
		const p = this.props.project;
		const { index } = this.props;
		const bg = p.image ? p.image : require('../../../assets/default_img.png');

		return (
			<div className="ChallengePage--Project">
				<div className="ChallengePage--Project_left">
					<div className="ChallengePage--Project_image" style={{ backgroundImage: 'url(' + bg + ')' }} />
				</div>
				<div className="ChallengePage--Project_right">
					<h4 className="ChallengePage--Project-name">#{index + 1} - {p.name}</h4>
					<p className="ChallengePage--Project-punchline">
						<em>{p.punchline}</em>
						<em className="ChallengePage--Project-toggle-desc" onClick={() => this.setState({ expanded: !this.state.expanded })}>{' '}{this.state.expanded ? 'Hide description' : 'Show description'}</em>
					</p>
					{this.state.expanded ? <p className="ChallengePage--Project-description">{p.description}</p> : null}
					<p className="ChallengePage--Project-location">
						<strong>Table:</strong> {p.location}
					</p>
					<p className="ChallengePage--Project-contactPhone">
						<strong>Phone number:</strong> <a href={'tel:' + p.contactPhone}>{p.contactPhone}</a>
					</p>
					{p.demo ? <a target="_blank" href={p.demo}><i className="fas fa-desktop"></i> Demo</a> : null}
					<a target="_blank" href={p.source}><i className="fas fa-code-branch"></i> Source</a>
				</div>
			</div>
		);
	}
}

export default ProjectRow;