import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import moment from 'moment-timezone';
import _ from 'lodash';
import { CSVLink } from 'react-csv';

import './style.scss';
import * as AdminSelectors from '../../../../redux/admin/selectors';
import * as AdminActions from '../../../../redux/admin/actions';
import API from '../../../../services/api';
import BannerManager from '../../../../components/BannerManager';
import SettingsItem from './SettingsItem';

class OverviewTab extends Component {
    static propTypes = {
        annotators: PropTypes.array,
        projects: PropTypes.array,
        event: PropTypes.object,
        loading: PropTypes.bool,
        error: PropTypes.bool
    };

    constructor(props) {
        super(props);

        this.state = {
            trackWinnersPublic: false,
            challenges: null,
            winners: null,
            exportData: null,
        };

        this.extendSubmissionDeadline = this.extendSubmissionDeadline.bind(this);
        this.toggleTrackWinnersPublic = this.toggleTrackWinnersPublic.bind(this);
        this.toggleFinalistVotingOpen = this.toggleFinalistVotingOpen.bind(this);
        this.exportData = this.exportData.bind(this);
    }

    componentDidMount() {
        const { adminToken, event } = this.props;

        API.adminGetChallengesForEvent(adminToken, event._id).then(challenges => {
            this.setState({ challenges });
        });

        API.adminGetChallengeWinnersForEvent(adminToken, event._id).then(winners => {
            this.setState({ winners });
        })
    }

    toggleTrackWinnersPublic() {
        const { adminToken, eventId, event } = this.props;

        return this.props.toggleTrackWinnersPublic(adminToken, eventId, !event.track_winners_public).then(event => {
            this.bannerManager.addBanner(
                {
                    type: 'info',
                    text: event.track_winners_public ? 'Track winners are now public' : 'Track winners are no longer public',
                    canClose: true,
                },
                'track-winners-public',
                5000
            )

            return event;
        });
    }

    toggleFinalistVotingOpen() {
        const { adminToken, eventId, event } = this.props;

        return this.props.toggleFinalistVotingOpen(adminToken, eventId, !event.finalist_voting_open).then(event => {
            this.bannerManager.addBanner(
                {
                    type: 'info',
                    text: event.finalist_voting_open ? 'Finalist voting is now open!' : 'Finalist voting is now closed',
                    canClose: true,
                },
                'finalist-voting-open',
                5000
            )

            return event;
        });
    }

    extendSubmissionDeadline() {
        const { adminToken, eventId, event } = this.props;
        return this.props.extendSubmissionDeadline(adminToken, eventId, !event.finalist_voting_open).then(event => {
            const newDeadline = moment(event.submissionDeadline)
                .tz(event.timezone)
                .format('HH:mm A');
            this.bannerManager.addBanner(
                {
                    type: 'info',
                    text: 'Submission deadline extended! The deadline is now ' + newDeadline,
                    canClose: true
                },
                'event-submission-extended-' + newDeadline,
                5000
            );

            return event;
        });
    }

    exportData() {
        const { annotators, projects } = this.props;

        const byTrack = {};

        _.each(projects, p => {
            if (byTrack.hasOwnProperty(p.track)) {
                byTrack[p.track].push(p);
            } else {
                byTrack[p.track] = [p];
            }
        });

        _.forOwn(byTrack, (value, key) => {
            byTrack[key] = _.reverse(_.sortBy(value, 'mu'));
        });

        const data = _.map(annotators, a => {
            const project = _.find(projects, p => {
                return p.team === a.team;
            });

            let challenges = [];

            if (project) {
                challenges = _.map(project.challenges, c => {
                    let chall = _.find(this.props.event.challenges, ch => {
                        return ch._id.toString() === c.toString();
                    });

                    if (chall) {
                        let challWinners = _.find(this.state.winners, w => {
                            return w.challenge.toString() === chall._id.toString();
                        });

                        let placement = 'No prize';

                        if (challWinners) {
                            const isFirst = challWinners.first.toString() === project._id.toString();
                            const isSecond = !isFirst && challWinners.second && challWinners.second.toString() === project._id.toString();
                            const isThird = !isSecond && challWinners.third && challWinners.third.toString() === project._id.toString();

                            if (isFirst) {
                                placement = '1st';
                            } else if (isSecond) {
                                placement = '2nd';
                            } else if (isThird) {
                                placement = '3rd';
                            }
                        }

                        return chall.name + ' by ' + chall.partner + ' (' + placement + ')';
                    } else {
                        return '';
                    }
                });
                console.log('CHALLENGES', challenges);
            }

            const track = project ? _.find(this.props.event.tracks, t => t._id === project.track) : null;

            return {
                'Name': a.name,
                'Email': a.email,
                'Project Name': project ? project.name : '',
                'Project Description': project ? project.description : '',
                'Track Name': track ? track.name : 'N/A',
                'Track Placement': project ? _.indexOf(byTrack[project.track], project) + 1 : 'N/A',
                'Challenges': project ? challenges.join(', ') : 'N/A',
            }
        });

        this.setState({
            exportData: data
        });

        return Promise.resolve();
    }

    render() {
        const { adminToken, eventId } = this.props;
        const { challenges, winners, exportData } = this.state;
        const { track_winners_public, finalist_voting_open } = this.props.event;

        return (
            <React.Fragment>
                <div className="OverviewTab--Settings">
                    <h2 className="OverviewTab--Settings_title">Event settings</h2>
                    <BannerManager ref={ref => (this.bannerManager = ref)} />
                    <SettingsItem
                        title="Extend submission deadline"
                        desc="Add 15 minutes to the submission deadline"
                        onClick={this.extendSubmissionDeadline}
                        buttonText="Extend"
                        isPositive={true}
                    />
                    <SettingsItem
                        title={track_winners_public ? "Track winners public" : "Track winners not public"}
                        desc={track_winners_public ? "Track winners are currently public" : "Track winners are not public"}
                        isPositive={!track_winners_public}
                        buttonText={!track_winners_public ? "Publish" : "Un-publish"}
                        onClick={this.toggleTrackWinnersPublic}
                    />
                    <SettingsItem
                        title={finalist_voting_open ? "Finalist voting open" : "Finalist voting closed"}
                        desc={finalist_voting_open ? "Participants are now able to submit their finalist votes" : "Participants are not able to submit finalist votes"}
                        isPositive={!finalist_voting_open}
                        buttonText={!finalist_voting_open ? "Open voting" : "Close voting"}
                        onClick={this.toggleFinalistVotingOpen}
                    />
                    {challenges && winners ? (
                        <SettingsItem
                            title={'Generate participant report'}
                            desc={'Generate a .csv with participants and their projects + placements'}
                            isPositive={true}
                            buttonText={'Generate'}
                            onClick={this.exportData}
                        />
                    ) : null}
                    {exportData ? (
                        <CSVLink
                            data={this.state.exportData}
                            filename={"participant-report.csv"}
                            className="btn btn-primary mt-2"
                            target="_blank"
                            separator=";"
                        >
                            Download report
                        </CSVLink>
                    ) : null}
                </div>
            </React.Fragment>
        );
    }
}

const mapStateToProps = state => ({
    adminToken: AdminSelectors.getToken(state)
});

const mapDispatchToProps = dispatch => ({
    extendSubmissionDeadline: (token, eventId) => dispatch(AdminActions.extendSubmissionDeadline(token, eventId)),
    toggleTrackWinnersPublic: (token, eventId, isPublic) => dispatch(AdminActions.toggleTrackWinnersPublic(token, eventId, isPublic)),
    toggleFinalistVotingOpen: (token, eventId, isOpen) => dispatch(AdminActions.toggleFinalistVotingOpen(token, eventId, isOpen)),
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(OverviewTab);
