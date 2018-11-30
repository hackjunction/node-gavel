import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import './style.scss';

import Utils from '../../../services/utils';
import API from '../../../services/api';

class FullProject extends Component {

	static propTypes = {
		project: PropTypes.object.isRequired,
		event: PropTypes.object.isRequired,
		teamMembers: PropTypes.array,
	}

	static defaultProps = {
		teamMembers: null,
	}

	constructor(props) {
		super(props);

		this.state = {
			teamMembers: this.props.teamMembers,
			teamMembersLoading: false,
		}
	}

	componentDidMount() {
		const { project, teamMembers } = this.props;
		if (!teamMembers && project.members_public) {
			this.setState({
				teamMembersLoading: true,
			}, () => {
				API.getMembersForProject(project._id).then(members => {
					this.setState({
						teamMembers: members,
						teamMembersLoading: false,
					});
				}).catch(error => {
					this.setState({
						teamMembers: null,
						teamMembersLoading: true,
					});
				})
			});
		}
	}

	renderDemoLink() {
		const { project } = this.props;

		if (!project.demo) return null;

		return (
			<a className="FullProject--Link" href={project.demo} target="_blank">
				<i className="FullProject--Link_icon fas fa-desktop"></i>
				<p className="FullProject--Link_text">Demo</p>
			</a>
		);
	}

	renderSourceLink() {
		const { project } = this.props;

		if (!project.source) return null;

		return (
			<a className="FullProject--Link" href={project.source} target="_blank">
				<i className="FullProject--Link_icon fas fa-code-branch"></i>
				<p className="FullProject--Link_text">Source Code</p>
			</a>
		);
	}

	renderTeamMembers() {
		const { teamMembers } = this.state;

		return _.map(teamMembers, (member) => {
			return (
				<div className="FullProject--TeamMember">
					<p className="FullProject--TeamMember_name"><strong>{member.name}</strong> {member.email}</p>
				</div>
			);
		});
	}

	renderChallenges() {
		const { project, event } = this.props;

		return _.map(project.challenges, (challengeId) => {
			return (
				<div className="FullProject--Challenge">
					<p className="FullProject--Challenge_name">{Utils.getChallengeName(challengeId, event.challenges)}</p>
				</div>
			);
		});
	}

	render() {
		const { project, event } = this.props;
		const { teamMembersLoading } = this.state;

		return (
			<div className="FullProject">
				<div className="FullProject--Image_wrapper">
					<img className="FullProject--Image_img" src={Utils.getProjectImage(project, false)} />
				</div>
				<div className="FullProject--Section">
					<h1 className="FullProject_name">{project.name}</h1>
					<p className="FullProject_punchline">{project.punchline}</p>
					<p className="FullProject_description">{project.description}</p>
				</div>
				<div className="FullProject--Section">
					<h4 className="FullProject--Section_title"><strong>Track</strong></h4>
					<p className="FullProject--Section_text">{Utils.getTrackName(project.track, event.tracks)}</p>
				</div>
				<div className="FullProject--Section">
					<h4 className="FullProject--Section_title"><strong>Challenges</strong></h4>
					{this.renderChallenges()}
				</div>
				{project.demo || project.source ? (
					<div className="FullProject--Section">
						<h4 className="FullProject--Section_title"><strong>Links</strong></h4>
						{this.renderDemoLink()}
						{this.renderSourceLink()}
					</div>
				) : null}
				{project.members_public ? (
					<div className="FullProject--Section">
						<h4 className="FullProject--Section_title"><strong>Team</strong></h4>
						{teamMembersLoading ? (
							<div className="FullProject--Section_loading">
								<i className="FullProject--Section_loading-spinner fa fa-spinner fa-spin"></i>
							</div>
						) : (
								this.renderTeamMembers()
							)}
					</div>
				) : null}
			</div>
		);
	}
}

export default FullProject;