import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import moment from 'moment-timezone';

import './style.scss';
import * as AdminSelectors from '../../../../redux/admin/selectors';
import * as AdminActions from '../../../../redux/admin/actions';

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
        }

        this.extendSubmissionDeadline = this.extendSubmissionDeadline.bind(this);
        this.toggleTrackWinnersPublic = this.toggleTrackWinnersPublic.bind(this);
        this.toggleFinalistVotingOpen = this.toggleFinalistVotingOpen.bind(this);
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

    render() {
        const { adminToken, eventId } = this.props;
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
