import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import moment from 'moment-timezone';
import './style.scss';

import Table from '../../../components/Table';
import SectionWrapper from '../../../components/forms/SectionWrapper';
import SectionTitle from '../../../components/forms/SectionTitle';
import TextField from '../../../components/forms/TextField';
import TextArea from '../../../components/forms/TextArea';
import SubmitButton from '../../../components/forms/SubmitButton';
import ErrorsBox from '../../../components/forms/ErrorsBox';

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

        this.addTeamMember = this.addTeamMember.bind(this);
        this.saveSubmission = this.saveSubmission.bind(this);
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

    renderSubmission() {
        return (
            <div>
                <TextField
                    ref={ref => (this.submissionName = ref)}
                    label="Project name"
                    placeholder="A catchy name for your project"
                    value={this.props.submission ? this.props.submission.name : ''}
                    onChange={name => {
                        this.props.editSubmission('name', name);
                    }}
                    required={true}
                    validate={value =>
                        Validators.stringMinMax(
                            value,
                            5,
                            50,
                            'Project name must be at least 5 characters',
                            'Project name cannot be over 50 characters'
                        )
                    }
                />
                <TextArea
                    ref={ref => (this.submissionDescription = ref)}
                    label="Description"
                    placeholder="What problem does your project solve? What tech did you use? What else do you want to tell us about it?"
                    value={this.props.submission ? this.props.submission.description : ''}
                    onChange={description => {
                        this.props.editSubmission('description', description);
                    }}
                    required={true}
                    validate={value =>
                        Validators.stringMinMax(
                            value,
                            1,
                            1000,
                            'Project description must be at least 1 character',
                            'Project description cannot be over 1000 characters'
                        )
                    }
                />
                <TextField
                    ref={ref => (this.submissionLocation = ref)}
                    label="Table Location"
                    placeholder="E.g. A7"
                    value={this.props.submission ? this.props.submission.location : ''}
                    onChange={location => {
                        this.props.editSubmission('location', location);
                    }}
                    required={true}
                    validate={value =>
                        Validators.stringMinMax(
                            value,
                            1,
                            50,
                            'Table location must be at least 2 characters',
                            'Table location cannot be over 50 characters'
                        )
                    }
                />
            </div>
        );
    }

    renderVotingTime() {
        const { event } = this.props;
        const now = moment().tz(event.timezone);

        return null;
    }

    render() {
        console.log('EVENT', this.props.event);
        return (
            <div className="TeamDashboard">
                <SectionTitle title="Team" showLoading={this.props.teamMembersLoading} />
                <SectionWrapper label="">
                    <div className="TeamDashboard--section">{this.renderTeamMembers()}</div>
                </SectionWrapper>

                <TextField
                    ref={ref => (this.addMemberName = ref)}
                    label="Name"
                    placeholder="John Doe"
                    value={this.state.addMemberName}
                    onChange={addMemberName => {
                        this.setState({ addMemberName });
                    }}
                    required={false}
                    validate={value =>
                        Validators.stringMinMax(
                            value,
                            1,
                            100,
                            'Name must be at least 1 character',
                            'Name cannot be over 100 characters'
                        )
                    }
                />
                <TextField
                    ref={ref => (this.addMemberEmail = ref)}
                    label="Email"
                    placeholder="john.doe@host.com"
                    value={this.state.addMemberEmail}
                    onChange={addMemberEmail => {
                        this.setState({ addMemberEmail });
                    }}
                    required={false}
                    validate={Validators.email}
                />
                <SectionWrapper label="">
                    <ErrorsBox errors={this.state.addMemberErrors} />

                    <SubmitButton
                        text="Add to team"
                        size="small"
                        align="right"
                        noMarginTop
                        onClick={this.addTeamMember}
                    />
                </SectionWrapper>

                <SectionTitle title="Submission" showLoading={this.props.submissionLoading} />
                {this.renderSubmission()}
                <SubmitButton
                    text="Update submission"
                    size="small"
                    align="right"
                    onClick={this.saveSubmission}
                    noMarginTop
                />
                <SectionTitle title="Voting" loading={this.props.eventLoading} />
                <SectionWrapper label="Voting time">
                    {this.renderVotingTime()}
                    <Link to="/vote">Start Voting</Link>
                </SectionWrapper>
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
    event: user.getEvent(state)
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
