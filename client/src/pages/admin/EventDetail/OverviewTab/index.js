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
                    {/* <div className="OverviewTab--Settings_item">
                        <div className="OverviewTab--Settings_item-left">
                            <h4 className="OverviewTab--Settings_item-name">Open winner voting</h4>
                            <p className="OverviewTab--Settings_item-desc">Open the voting between finalist teams</p>
                        </div>
                        <div className="OverviewTab--Settings_item-right">
                            <button className="OverviewTab--Settings_item-button">Announce</button>
                        </div>
                    </div>
                    <div className="OverviewTab--Settings_item">
                        <div className="OverviewTab--Settings_item-left">
                            <h4 className="OverviewTab--Settings_item-name">Announce track winners</h4>
                            <p className="OverviewTab--Settings_item-desc">
                                Make the winners of each track public to participants
                            </p>
                        </div>
                        <div className="OverviewTab--Settings_item-right">
                            <button className="OverviewTab--Settings_item-button">Announce</button>
                        </div>
                    </div>
                    <div className="OverviewTab--Settings_item">
                        <div className="OverviewTab--Settings_item-left">
                            <h4 className="OverviewTab--Settings_item-name">Close submissions</h4>
                            <p className="OverviewTab--Settings_item-desc">
                                Override the submission timetable and close submissions now
                            </p>
                        </div>
                        <div className="OverviewTab--Settings_item-right">
                            <button className="OverviewTab--Settings_item-button">Close</button>
                        </div>
                    </div>
                    <div className="OverviewTab--Settings_item">
                        <div className="OverviewTab--Settings_item-left">
                            <h4 className="OverviewTab--Settings_item-name">Close voting</h4>
                            <p className="OverviewTab--Settings_item-desc">
                                Override the voting timetable and close voting now
                            </p>
                        </div>
                        <div className="OverviewTab--Settings_item-right">
                            <button className="OverviewTab--Settings_item-button">Close</button>
                        </div>
                    </div> */}
                </div>
                <h4>Cool graphs and stuff here</h4>
                <p>Projects: {this.props.projects.length}</p>
                <p>Annotators: {this.props.annotators.length}</p>
                <p>Event: {this.props.event.name}</p>
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
