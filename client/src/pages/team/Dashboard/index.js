import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { connect } from 'react-redux';
import './style.scss';

import Table from '../../../components/Table';
import SectionWrapper from '../../../components/forms/SectionWrapper';
import SectionTitle from '../../../components/forms/SectionTitle';

import API from '../../../services/api';
import * as user from '../../../redux/user/selectors';

class TeamDashboard extends Component {

    constructor(props) {
        super(props);

        this.state = {
            nameInput: '',
            emailInput: '',
            teamMembers: [],
            submission: {},
        };

        this.addTeamMember = this.addTeamMember.bind(this);
    }

    componentDidMount() {
        API.getTeamMembers(this.props.user).then((teamMembers) => {
            console.log('TEAM MEMBERs', teamMembers);
            this.setState({
                teamMembers
            });
        });

        API.getSubmission(this.props.user).then((submission) => {
            this.setState({
                submission
            });
        });
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

    render() {
        return (
            <div className="TeamDashboard">
                <SectionTitle title="Team" />
                <SectionWrapper label="Team members">
                    <Table
                        columns={[
                            {
                                key: 'name',
                                title: 'Name',
                                render: item => <span>{item.name}</span>
                            },
                            {
                                key: 'email',
                                title: 'Email',
                                render: item => <span>{item.email}</span>
                            },
                            {
                                key: 'remove',
                                title: '',
                                render: item => (
                                    <span
                                        className="CreateTeam--remove-team-member"
                                        onClick={() => this.removeTeamMember(item.email)}
                                    >
                                        Remove
                                    </span>
                                )
                            }
                        ]}
                        items={this.state.teamMembers}
                    />
                </SectionWrapper>
                <div style={{ height: '50px' }} />
                <SectionWrapper label="Add team members" hasError={this.state.teamMemberError}>
                    <div className="FormField--input-wrapper">
                        <input
                            ref={ref => (this.nameInput = ref)}
                            className="FormField--input"
                            type="text"
                            placeholder="Name"
                            value={this.state.nameInput}
                            onChange={e => this.setState({ nameInput: e.target.value })}
                        />
                        <input
                            className="FormField--input"
                            type="text"
                            placeholder="Email"
                            value={this.state.emailInput}
                            onChange={e => this.setState({ emailInput: e.target.value })}
                        />
                        <button className="CreateTeam--add-member-button" onClick={this.addTeamMember}>
                            Add
                        </button>
                    </div>
                    <small className="FormField--hint">
                        Add members to your team by providing their name and email address
                    </small>
                    <small className="FormField--error">{this.state.teamMemberError}</small>
                </SectionWrapper>
                <div style={{ height: '50px' }} />
                <SectionTitle title="Submission" />
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    user: user.getUser(state),
});

export default connect(mapStateToProps)(TeamDashboard);
