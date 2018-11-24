import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

class FinalsTab extends Component {
	static propTypes = {
		projects: PropTypes.array,
		annotators: PropTypes.array,
		event: PropTypes.object
	}

	getTrackWinner(projects) {
		const eligible = _.filter(projects, (p) => p.active);

		return _.maxBy(eligible, 'mu');
	}

	getTrackWinners() {
		const { projects, annotators } = this.props;
		const byTrack = _.groupBy(projects, 'track');

		const trackWinners = [];

		_.forOwn(byTrack, (trackProjects, trackId) => {
			const winner = this.getTrackWinner(trackProjects);
			trackWinners.push({
				trackId,
				winner,
				votes: _.filter(annotators, (a) => a.winner_vote === winner._id).length,
			});
		});

		return _.reverse(_.sortBy(trackWinners, 'votes'));
	}

	renderTrackWinners() {
		const winners = this.getTrackWinners();

		return _.map(winners, ({ trackId, winner, votes }) => {
			return (
				<div className="FinalsTab--ProjectBlock">
					<h1>{winner.name}</h1>
					<p>{winner.punchline}</p>
					<p>Votes: {votes}</p>
				</div>
			);
		})
	}

	render() {
		return (
			<div className="FinalsTab">
				<h2 className="FinalsTab">Finalist voting</h2>
				{this.renderTrackWinners()}
			</div>
		);
	}
}

export default FinalsTab;