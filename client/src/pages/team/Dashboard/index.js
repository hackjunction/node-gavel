import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import './style.scss';

import SubmissionForm from './SubmissionForm';
import FinalistVote from './FinalistVote';
import PeerReview from './PeerReview';
import Team from './Team';

import TabView from '../../../components/TabView';

import * as user from '../../../redux/user/selectors';
import * as UserActions from '../../../redux/user/actions';

class TeamDashboard extends Component {
    static propTypes = {
        user: PropTypes.object,
        userLoading: PropTypes.bool,
        userError: PropTypes.bool,
        teamMembersLoading: PropTypes.bool,
        teamMembersError: PropTypes.bool,
        teamMembers: PropTypes.array,
        submissionLoading: PropTypes.bool,
        submissionError: PropTypes.bool,
        submission: PropTypes.object,
        eventLoading: PropTypes.bool,
        eventError: PropTypes.bool,
        event: PropTypes.object
    };

    constructor(props) {
        super(props);

        this.state = {
            addMemberName: '',
            addMemberEmail: '',
            addMemberErrors: [],
            removingTeamMember: null
        };
    }

    componentDidMount() {
        const { fetchTeamMembers, fetchSubmission, fetchEvent, user } = this.props;

        fetchTeamMembers(user.secret);
        fetchSubmission(user.secret);
        fetchEvent(user.secret);
    }

    render() {
        return (
            <div>
                <div className="TeamDashboard--Header">
                    <h1 className="TeamDashboard--Header_title">{this.props.event ? this.props.event.name : ''}</h1>
                </div>
                <TabView
                    tabs={[
                        {
                            key: 'submission',
                            label: 'Submission',
                            renderContent: () => <SubmissionForm />,
                            loading: !this.props.event
                        },
                        {
                            key: 'peer-review',
                            label: 'Demo Expo',
                            renderContent: () => <PeerReview />,
                            loading: this.props.eventLoading
                        },
                        {
                            key: 'finalist-vote',
                            label: 'Finals',
                            renderContent: () => <FinalistVote />,
                            loading: this.props.eventLoading
                        },
                        {
                            key: 'team',
                            label: 'Team',
                            renderContent: () => <Team />,
                            loading: this.props.teamMembersLoading
                        }
                    ]}
                    activeTab={this.state.activeTab}
                    onTabChange={activeTab => this.setState({ activeTab })}
                />
            </div>
        );
    }
}

const mapStateToProps = state => ({
    teamMembersLoading: user.isTeamMembersLoading(state),
    submissionLoading: user.isSubmissionLoading(state),
    eventLoading: user.isEventLoading(state),
    user: user.getUser(state),
    event: user.getEvent(state),
    getNowInEventTime: user.getNowInEventTime(state),
    getSubmissionDeadline: user.getSubmissionDeadline(state),
});

const mapDispatchToProps = dispatch => ({
    fetchUser: secret => dispatch(UserActions.fetchUser(secret)),
    fetchTeamMembers: secret => dispatch(UserActions.fetchTeamMembers(secret)),
    fetchSubmission: secret => dispatch(UserActions.fetchSubmission(secret)),
    fetchEvent: secret => dispatch(UserActions.fetchEvent(secret))
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(TeamDashboard);
