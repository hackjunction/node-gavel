import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import TimeAgo from 'react-timeago';
import moment from 'moment-timezone';
import './style.scss';

import SubmissionForm from './SubmissionForm';

import TabView from '../../../components/TabView';
import BannerManager from '../../../components/BannerManager';
import SectionWrapper from '../../../components/forms/SectionWrapper';
import SectionTitle from '../../../components/forms/SectionTitle';
import TextField from '../../../components/forms/TextField';
import TextArea from '../../../components/forms/TextArea';
import SubmitButton from '../../../components/forms/SubmitButton';
import ErrorsBox from '../../../components/forms/ErrorsBox';
import DropDown from '../../../components/forms/DropDown';

import * as user from '../../../redux/user/selectors';
import * as UserActions from '../../../redux/user/actions';
import Validators from '../../../services/validators';

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

        this.dateTest = moment()
            .tz('Europe/Helsinki')
            .add(10, 'minutes');

        this.addTeamMember = this.addTeamMember.bind(this);
        this.saveSubmission = this.saveSubmission.bind(this);
        this.renderVoting = this.renderVoting.bind(this);
    }

    componentDidMount() {
        const { fetchTeamMembers, fetchSubmission, fetchEvent, user } = this.props;

        fetchTeamMembers(user.secret);
        fetchSubmission(user.secret);
        fetchEvent(user.secret);
    }

    saveSubmission() {
        const { submission, saveSubmission } = this.props;
        const { secret } = this.props.user;

        saveSubmission(submission, secret);
    }

    addTeamMember() {
        const name = this.state.addMemberName;
        const email = this.state.addMemberEmail;

        const nameValidation = this.addMemberName.isValid();

        if (nameValidation.error) {
            window.alert('Please enter a valid name');
            return;
        }

        const emailValidation = this.addMemberEmail.isValid();

        if (emailValidation.error) {
            window.alert('Please enter a valid email address');
            return;
        }

        if (_.findIndex(this.props.teamMembers, t => t.email === email) !== -1) {
            window.alert('You already have a team member with that email');
            return;
        }

        this.props.addTeamMember(name, email, this.props.user.secret);
    }

    removeTeamMember(_id) {
        this.props.removeTeamMember(_id, this.props.user.secret);
    }

    renderTeamMembers() {
        const { teamMembers } = this.props;

        return _.map(teamMembers, member => {
            const isRemove = this.state.removingTeamMember === member._id;
            return (
                <div className="TeamDashboard--team-member">
                    <div className="TeamDashboard--team-member-details">
                        <p className="TeamDashboard--team-member-details__name">{member.name}</p>
                        <p className="TeamDashboard--team-member-details__email">{member.email}</p>
                    </div>
                    <div
                        className={
                            isRemove ? 'TeamDashboard--team-member-remove active' : 'TeamDashboard--team-member-remove'
                        }
                    >
                        <div
                            className="TeamDashboard--team-member-remove__button"
                            onClick={() => {
                                this.setState({
                                    removingTeamMember: member._id
                                });
                            }}
                        >
                            <span>{'Remove'}</span>
                        </div>
                        <div
                            className="TeamDashboard--team-member-remove__confirm"
                            onClick={() => this.removeTeamMember(member._id)}
                        >
                            <span>{'Confirm'}</span>
                        </div>
                        <div
                            className="TeamDashboard--team-member-remove__cancel"
                            onClick={() =>
                                this.setState({
                                    removingTeamMember: null
                                })
                            }
                        >
                            <span>{'Cancel'}</span>
                        </div>
                    </div>
                </div>
            );
        });
    }

    renderAddMemberForm() {
        return <div className="TeamDashboard--add-member-form" />;
    }

    getBanners() {
        const { isVotingOpen, isSubmissionsOpen, submission, submissionDeadline } = this.props;

        const banners = [];
        if (isSubmissionsOpen) {
            if (!submission.hasOwnProperty('_id')) {
                banners.push({
                    type: 'warning',
                    text:
                        'Submissions are open! Make sure to submit your project before the deadline on ' +
                        submissionDeadline.format('MMMM Do HH:mm A'),
                    canClose: true
                });
            }
        }

        if (isVotingOpen) {
            banners.push({
                type: 'info',
                text:
                    'Voting is open! You can access the voting page via the Voting tab. Please also make sure that your submitted table location is still correct, so that other people can find your awesome project!',
                canClose: true
            });
        }

        return banners;
    }

    renderVoting() {
        const { votingStartTime, votingEndTime, isVotingOpen, user, event } = this.props;

        let content = null;
        if (isVotingOpen) {
            if (user.read_welcome) {
                content = (
                    <div>
                        <h4>Voting is open!</h4>
                        <p>
                            Click the link below to access the voting page and continue voting where you left off.
                            Voting ends at {votingEndTime.format('MMMM Do HH:mm a')}.
                        </p>
                        <Link to="/vote">Continue voting</Link>
                    </div>
                );
            } else {
                content = (
                    <div>
                        <h4>Voting is open!</h4>
                        <p>
                            Click the button below to access the voting page. You will be shown a short tutorial on how
                            the voting system works before you begin. Voting ends at{' '}
                            {votingEndTime.format('MMMM Do HH:mm a')}.
                        </p>
                        <Link to="/vote">Start voting</Link>
                    </div>
                );
            }
        } else {
            if (votingStartTime.isAfter()) {
                content = (
                    <div>
                        <h4>Voting has not yet begun</h4>
                        <p>
                            The voting platform will open <strong>{votingStartTime.format('MMMM Do HH:mm a')}</strong>{' '}
                            and you will be able to access it from this page.
                        </p>
                    </div>
                );
            } else {
                content = (
                    <div>
                        <h4>Voting is closed!</h4>
                        <p>
                            The voting period is over and the voting platform is no longer accessible. Thank you for
                            participating!
                        </p>
                    </div>
                );
            }
        }
        return (
            <div className="Voting-Tab">
                <h4>Peer Reviewing</h4>
                <p>
                    The winner of {event.name} will be decided via peer review. This means that <strong>you</strong> get
                    to choose who deserves the main prize. Peer reviewing will take place in this platform once
                    submissions have closed. You will be able to start voting here once the reviewing period begins.
                </p>
                {content}
            </div>
        );
    }

    renderTeam() {
        return <h1>Team</h1>;
    }

    render() {
        return (
            <div>
                <BannerManager ref={ref => (this.bannerManager = ref)} banners={this.getBanners()} />
                <TabView
                    tabs={[
                        {
                            key: 'submission',
                            label: 'Submission',
                            renderContent: () => <SubmissionForm />,
                            loading: !this.props.submission || !this.props.event
                        },
                        {
                            key: 'voting',
                            label: 'Voting',
                            renderContent: this.renderVoting,
                            loading: this.props.eventLoading
                        },
                        {
                            key: 'team',
                            label: 'Team',
                            renderContent: this.renderTeam,
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
    user: user.getUser(state),
    userLoading: user.isLoading(state),
    userError: user.isError(state),
    teamMembersLoading: user.isTeamMembersLoading(state),
    teamMembersError: user.isTeamMembersError(state),
    teamMembers: user.getTeamMembers(state),
    submissionLoading: user.isSubmissionLoading(state),
    submissionError: user.isSubmissionError(state),
    submission: user.getSubmission(state),
    eventLoading: user.isEventLoading(state),
    eventError: user.isEventError(state),
    event: user.getEvent(state),
    votingStartTime: user.getVotingStartTime(state),
    votingEndTime: user.getVotingEndTime(state),
    isVotingOpen: user.isVotingOpen(state),
    submissionDeadline: user.getSubmissionDeadline(state),
    isSubmissionsOpen: user.isSubmissionsOpen(state)
});

const mapDispatchToProps = dispatch => ({
    fetchUser: secret => dispatch(UserActions.fetchUser(secret)),
    fetchTeamMembers: secret => dispatch(UserActions.fetchTeamMembers(secret)),
    fetchSubmission: secret => dispatch(UserActions.fetchSubmission(secret)),
    fetchEvent: secret => dispatch(UserActions.fetchEvent(secret)),
    editSubmission: (field, value) => dispatch(UserActions.editSubmission(field, value)),
    saveSubmission: (submission, secret) => dispatch(UserActions.saveSubmission(submission, secret)),
    addTeamMember: (name, email, secret) => dispatch(UserActions.addTeamMember(name, email, secret)),
    removeTeamMember: (_id, secret) => dispatch(UserActions.removeTeamMember(_id, secret))
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(TeamDashboard);
