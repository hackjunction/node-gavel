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

    extendSubmissionDeadline() {
        const { adminToken, eventId } = this.props;
        return this.props.extendSubmissionDeadline(adminToken, eventId).then(event => {
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

        return (
            <React.Fragment>
                <div className="OverviewTab--Settings">
                    <h2 className="OverviewTab--Settings_title">Event settings</h2>
                    <BannerManager ref={ref => (this.bannerManager = ref)} />
                    <SettingsItem
                        title="Extend submission deadline"
                        desc="Add 15 minutes to the submission deadline"
                        onClick={() => this.extendSubmissionDeadline(adminToken, eventId)}
                        buttonText="Extend"
                    />
                    <SettingsItem
                        title="Publish track winners"
                        desc="If enabled, track winners can be seen by participants"
                        onClick={() => this.publishTrackWinners(adminToken, eventId)}
                        buttonText="Publish"
                    />
                    <SettingsItem
                        title="Open finalist voting"
                        desc="If enabled, participants can submit their finalist votes"
                        onClick={() => this.openFinalistVoting(adminToken, eventId)}
                        buttonText="Open"
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
    extendSubmissionDeadline: (token, eventId) => dispatch(AdminActions.extendSubmissionDeadline(token, eventId))
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(OverviewTab);
