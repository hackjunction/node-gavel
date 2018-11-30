import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import './style.scss';

import Utils from '../../../services/utils';

class ProjectGridBlock extends Component {

	static propTypes = {
		project: PropTypes.object.isRequired,
		event: PropTypes.object.isRequired,
		isLink: PropTypes.bool,
		linkText: PropTypes.string,
	};

	static defaultProps = {
		isLink: false,
		linkText: 'View project'
	};

	renderAwards() {
		const { project, event } = this.props;

		if (!project.trackPos) {
			return null;
		}

		switch (project.trackPos) {
			case 1: return (
				<div className="ProjectGridBlock--Award">
					<i className="ProjectGridBlock--Award_icon-gold fas fa-award"></i>
					<span className="ProjectGridBlock--Award_text">1st: {Utils.getTrackName(project.track, event.tracks)}</span>
				</div>
			);
			case 2: return (
				<div className="ProjectGridBlock--Award">
					<i className="ProjectGridBlock--Award_icon-silver fas fa-award"></i>
					<span className="ProjectGridBlock--Award_text">2nd: {Utils.getTrackName(project.track, event.tracks)}</span>
				</div>
			);
			case 3: return (
				<div className="ProjectGridBlock--Award">
					<i className="ProjectGridBlock--Award_icon-bronze fas fa-award"></i>
					<span className="ProjectGridBlock--Award_text">3rd: {Utils.getTrackName(project.track, event.tracks)}</span>
				</div>
			);
			default: return null;
		}
	}

	render() {
		const { project, isLink, linkText, linkTo } = this.props;

		return (
			<div className="ProjectGridBlock">
				{isLink ? (
					<Link className="ProjectGridBlock--Link" to={linkTo}>
						<p className="ProjectGridBlock--Link_text">{linkText}</p>
					</Link>
				) : null}
				<div className="ProjectGridBlock--Image">
					<img className="ProjectGridBlock--Image_img" src={Utils.getProjectImage(project, true)} />
				</div>
				<div className="ProjectGridBlock--Content">
					<h4 className="ProjectGridBlock--Content_title">{project.name}</h4>
					<p className="ProjectGridBlock--Content_punchline">{project.punchline}</p>
				</div>
				{this.renderAwards()}
			</div>
		);
	}
}

export default ProjectGridBlock;