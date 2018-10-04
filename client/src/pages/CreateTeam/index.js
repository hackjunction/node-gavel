import React, { Component } from 'react';
import _ from 'lodash';
import './style.css';

import API from '../../services/api';

class CreateTeam extends Component {
    constructor(props) {
        super(props);

        this.state = {
            members: [],
            teamMemberName: '',
            teamMemberEmail: '',
            secretCode: '',
            event: null,
            eventLoading: false,
            eventError: ''
        };

        this.addTeamMember = this.addTeamMember.bind(this);
        this.removeTeamMember = this.removeTeamMember.bind(this);
        this.findEvent = this.findEvent.bind(this);
        this.clearEvent = this.clearEvent.bind(this);
    }

    addTeamMember(e) {
        e.preventDefault();

        if (_.findIndex(this.state.members, member => member.email === this.state.teamMemberEmail) !== -1) {
            window.alert("You've already added a team member with that email address!");
            return;
        }

        this.setState({
            members: _.concat(this.state.members, {
                name: this.state.teamMemberName,
                email: this.state.teamMemberEmail
            }),
            teamMemberName: '',
            teamMemberEmail: ''
        });
    }

    removeTeamMember(email) {
        this.setState({
            members: _.filter(this.state.members, member => {
                return member.email !== email;
            })
        });
    }

    findEvent(e) {
        e.preventDefault();

        this.setState({
            eventLoading: true,
            eventError: ''
        });

        API.getEventWithCode(this.state.secretCode)
            .then(event => {
                console.log('GOT EVENT', event);
                this.setState({
                    event,
                    eventLoading: false
                });
            })
            .catch(error => {
                this.setState({
                    eventLoading: false,
                    eventError: error.message
                });
            });
    }

    clearEvent(e) {
        e.preventDefault();

        this.setState({
            event: null,
            eventLoading: false,
            eventError: ''
        });
    }

    renderEventForm() {
        if (this.state.event) {
            return (
                <div className="CreateTeam--section row">
                    <div className="CreateTeam--section-header col-12">
                        <h3>{this.state.event.name}</h3>
                        <button type="button" class="btn btn-outline-danger" onClick={this.clearEvent}>
                            Change
                        </button>
                    </div>
                </div>
            );
        } else {
            return (
                <div className="CreateTeam--section">
                    <div className="row">
                        <h3 className="CreateTeam--section-header col-12">Your event</h3>
                        <p className="CreateTeam--section-desc col-12">
                            Enter the secret code for the event you are at
                        </p>
                    </div>
                    <div className="row">
                        <form className="CreateTeam--event-code-form col-12" onSubmit={this.addTeamMember}>
                            <div className="form-group">
                                <label for="secretCode" className="sr-only">
                                    Secret code
                                </label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="secretCode"
                                    placeholder="Secret code"
                                    onChange={e => this.setState({ secretCode: e.target.value })}
                                    value={this.state.secretCode}
                                />
                            </div>
                            <button type="submit" className="btn btn-primary" onClick={this.findEvent}>
                                Find event
                            </button>
                        </form>
                    </div>
                </div>
            );
        }
    }

    renderTeamMemberForm() {
        if (!this.state.event) {
            return null;
        }

        return (
            <div>
                <h3 className="CreateTeam--section-header col-12">Add team members</h3>
                <p className="CreateTeam--section-desc col-12">Add the name and email of all members of your team</p>
                <form className="CreateTeam--add-member-form col-12" onSubmit={this.addTeamMember}>
                    <div className="form-group">
                        <label for="name" className="sr-only">
                            Name
                        </label>
                        <input
                            type="text"
                            className="form-control"
                            id="name"
                            placeholder="Name"
                            onChange={e => this.setState({ teamMemberName: e.target.value })}
                            value={this.state.teamMemberName}
                        />
                    </div>
                    <div className="form-group">
                        <label for="email" className="sr-only">
                            Email
                        </label>
                        <input
                            type="email"
                            className="form-control"
                            id="email"
                            placeholder="Email Address"
                            onChange={e => this.setState({ teamMemberEmail: e.target.value })}
                            value={this.state.teamMemberEmail}
                        />
                    </div>
                    <button type="submit" className="btn btn-primary">
                        Add team member
                    </button>
                </form>
            </div>
        );
    }

    renderTeamMembers() {
        if (this.state.members.length === 0 || !this.state.event) {
            return null;
        }

        const items = _.map(this.state.members, (member, index) => {
            return (
                <tr>
                    <td valign="center" scope="row">
                        {index + 1}
                    </td>
                    <td valign="center">{member.name}</td>
                    <td valign="center">{member.email}</td>
                    <td valign="center" align="right">
                        <button
                            type="button"
                            class="btn btn-outline-danger"
                            onClick={() => this.removeTeamMember(member.email)}
                        >
                            Remove
                        </button>
                    </td>
                </tr>
            );
        });

        return (
            <div className="col-12">
                <table className="CreateTeam--table table">
                    <thead>
                        <tr>
                            <th scope="col">#</th>
                            <th scope="col">Name</th>
                            <th scope="col">Email</th>
                            <th scope="col" />
                        </tr>
                    </thead>
                    <tbody>{items}</tbody>
                </table>
            </div>
        );
    }

    renderSubmit() {
        return (
            <div className="CreateTeam--section row">
                <div className="CreateTeam--section-header col-12">
                    <h3>Submit your team</h3>
                    <button type="button" class="btn btn-primary" onClick={this.submitTeam}>
                        Submit your team
                    </button>
                </div>
            </div>
        );
    }

    render() {
        return (
            <div className="container mt-3">
                {this.renderEventForm()}
                <div className="CreateTeam--section row">
                    {this.renderTeamMemberForm()}
                    {this.renderTeamMembers()}
                </div>
                {this.renderSubmit()}
            </div>
        );
    }
}

export default CreateTeam;
