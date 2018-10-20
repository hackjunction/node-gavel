import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { connect } from 'react-redux';
import './style.scss';

import Table from '../../../components/Table';
import SectionWrapper from '../../../components/forms/SectionWrapper';
import SectionTitle from '../../../components/forms/SectionTitle';
import TextField from '../../../components/forms/TextField';
import TextArea from '../../../components/forms/TextArea';
import SubmitButton from '../../../components/forms/SubmitButton';

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
    submission: PropTypes.object
  };

  constructor(props) {
    super(props);

    this.state = {
      nameInput: '',
      emailInput: '',
      removingTeamMember: null
    };

    this.addTeamMember = this.addTeamMember.bind(this);
  }

  componentDidMount() {
    const { fetchTeamMembers, fetchSubmission, user } = this.props;

    fetchTeamMembers(user.secret);
    fetchSubmission(user.secret);
  }

  addTeamMember() {
    const name = this.state.nameInput;
    const email = this.state.emailInput;

    if (!name || name.length === 0) {
      this.setState({
        teamMemberError: 'Please enter a valid name'
      });
      return;
    }

    if (_.findIndex(this.state.teamMembers, t => t.email === email) !== -1) {
      this.setState({
        teamMemberError: "You've already added a team member with that email"
      });
    }

    if (Validators.email(email).error === true) {
      this.setState({
        teamMemberError: 'Please enter a valid email address'
      });
      return;
    }

    //TODO: Add the team member via an api call

    this.nameInput.focus();
  }

  removeTeamMember(email) {
    //TODO: Remove the team member via an api call
  }

  renderTeamMembers() {
    const { teamMembers } = this.props;

    return _.map(teamMembers, member => {
      const isRemove = this.state.removingTeamMember === member.id;
      return (
        <div className="TeamDashboard--team-member">
          <div className="TeamDashboard--team-member-details">
            <p className="TeamDashboard--team-member-details__name">
              {member.name}
            </p>
            <p className="TeamDashboard--team-member-details__email">
              {member.email}
            </p>
          </div>
          <div
            className={
              isRemove
                ? 'TeamDashboard--team-member-remove active'
                : 'TeamDashboard--team-member-remove'
            }
          >
            <div
              className="TeamDashboard--team-member-remove__button"
              onClick={() => {
                this.setState({
                  removingTeamMember: member.id
                });
              }}
            >
              <span>{'Remove'}</span>
            </div>
            <div
              className="TeamDashboard--team-member-remove__confirm"
              onClick={() => window.alert('Remove this nephew')}
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
              500,
              'Project description must be at least 1 character',
              'Project description cannot be over 500 characters'
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

  render() {
    return (
      <div className="TeamDashboard">
        <SectionTitle
          title="Team"
          showLoading={this.props.teamMembersLoading}
        />
        <SectionWrapper label="">
          <div className="TeamDashboard--section">
            {this.renderTeamMembers()}
          </div>
        </SectionWrapper>

        <SectionWrapper label="">
          <SubmitButton text="Add team members" size="small" align="right" />
        </SectionWrapper>
        <SectionTitle
          title="Submission"
          showLoading={this.props.submissionLoading}
        />
        {this.renderSubmission()}
        <SubmitButton text="Update submission" size="small" align="right" />
        <SectionTitle title="Voting" />
        <SectionWrapper label="">
          <p>Voting stuff here</p>
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
  submission: user.getSubmission(state)
});

const mapDispatchToProps = dispatch => ({
  fetchUser: secret => dispatch(UserActions.fetchUser(secret)),
  fetchTeamMembers: secret => dispatch(UserActions.fetchTeamMembers(secret)),
  fetchSubmission: secret => dispatch(UserActions.fetchSubmission(secret)),
  editSubmission: (field, value) =>
    dispatch(UserActions.editSubmission(field, value))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TeamDashboard);
