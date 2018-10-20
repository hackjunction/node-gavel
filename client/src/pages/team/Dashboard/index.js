import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { connect } from 'react-redux';
import './style.scss';

import Table from '../../../components/Table';
import SectionWrapper from '../../../components/forms/SectionWrapper';
import SectionTitle from '../../../components/forms/SectionTitle';

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

    console.log(this.props.user);

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

    if (!this.validateEmail(email)) {
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

  validateEmail(email) {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }

  renderTeamMembers() {
    const { teamMembers } = this.props;
    console.log('TEAM', teamMembers);

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
          <p>Add team members</p>
        </SectionWrapper>
        <SectionTitle
          title="Submission"
          showLoading={this.props.submissionLoading}
        />
        <SectionWrapper label="">
          <p>Your submission here</p>
        </SectionWrapper>
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
  fetchSubmission: secret => dispatch(UserActions.fetchSubmission(secret))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TeamDashboard);
