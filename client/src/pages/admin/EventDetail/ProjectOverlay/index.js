import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import './style.scss';

class ProjectOverlay extends Component {

	static propTypes = {
		project: PropTypes.object,
		annotators: PropTypes.array,
		event: PropTypes.object,
		onClose: PropTypes.func,
	}

	renderChallenges() {

		return _.map(this.props.project.challenges, (challengeId) => {
			const challenge = _.find(this.props.event.challenges, (c) => c._id === challengeId);

			if (!challenge) {
				return null;
			} else {
				return <p className="ProjectOverlay_challenge">{challenge.name} / {challenge.partner}</p>
			}
		})
	}

	renderTeamMembers() {
		const members = _.filter(this.props.annotators, (annotator) => {
			return annotator.team === this.props.project.team;
		})

		return _.map(members, (member) => {
			return <p className="ProjectOverlay_teamMember">{member.name} / {member.email}</p>
		});
	}

	render() {
		const { project } = this.props;
		return (
			<div className="ProjectOverlay">
				<div className="ProjectOverlay_close" onClick={this.props.onClose}>
					<span>Close</span>
					<i className="fa fa-times"></i>
				</div>
				<div className="ProjectOverlay_content">
					<img className="ProjectOverlay_image" src={project.image ? project.image : require('../../../../assets/default_img.png')} />
					<div className="ProjectOverlay_inner">
						<h1 className="ProjectOverlay_title">{project.name}</h1>
						<p className="ProjectOverlay_punchline">{project.punchline}</p>
						<p className="ProjectOverlay_description">{project.description}</p>
					</div>
					<div className="ProjectOverlay_inner">
						<a className="ProjectOverlay_link" href={project.source}>
							<i className="fab fa-github"></i>
							<span>Source code</span>
						</a>
						{project.demo ? (
							<a className="ProjectOverlay_link" href={project.demo}>
								<i className="fas fa-desktop"></i>
								<span>Demo</span>
							</a>
						) : null}
					</div>
					<div className="ProjectOverlay_inner">
						<h2 className="ProjectOverlay_title">Challenges</h2>
						{this.renderChallenges()}
					</div>
					<div className="ProjectOverlay_inner">
						<h2 className="ProjectOverlay_title">Team members</h2>
						{this.renderTeamMembers()}
					</div>
				</div>
			</div>
		);
	}
}

export default ProjectOverlay;