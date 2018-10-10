import React, { Component } from 'react';
import _ from 'lodash';
import phone from 'phone';
import './style.scss';

import SubmitButton from '../../../components/forms/SubmitButton';
import TextField from '../../../components/forms/TextField';
import NonEditableTextField from '../../../components/forms/NonEditableTextField';
import Validators from '../../../services/validators';

import Table from '../../../components/Table';

import API from '../../../services/api';

class CreateTeam extends Component {
    constructor(props) {
        super(props);

        this.state = {
            event: null,
            eventLoading: false,
            eventError: false,
            eventCode: '',
            teamMembers: [],
            nameInput: '',
            emailInput: '',
            teamMemberError: '',
            contactPhone: '',
            formError: '',
            formLoading: false,
            formSubmitted: false
        };

        this.findEvent = this.findEvent.bind(this);
        this.addTeamMember = this.addTeamMember.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
    }

    findEvent() {
        this.setState(
            {
                eventLoading: true,
                eventError: false
            },
            () => {
                API.getEventWithCode(this.state.eventCode)
                    .then(event => {
                        this.setState({
                            event,
                            eventLoading: false
                        });
                    })
                    .catch(error => {
                        this.setState({
                            event: null,
                            eventLoading: false,
                            eventError: true
                        });
                    });
            }
        );
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

        this.setState({
            teamMembers: _.concat(this.state.teamMembers, { name, email }),
            nameInput: '',
            emailInput: '',
            teamMemberError: ''
        });

        this.nameInput.focus();
    }

    removeTeamMember(email) {
        this.setState({
            teamMembers: _.filter(this.state.teamMembers, t => t.email !== email)
        });
    }

    validateEmail(email) {
        const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }

    onSubmit() {
        if (this.state.teamMembers.length === 0) {
            this.setState({
                formError: 'Your team needs to have at least one member!'
            });
            return;
        }

        if (this.state.teamMembers.length > 6) {
            this.setState({
                formError: 'Your team can have at most 6 people'
            });
            return;
        }

        if (phone(this.state.contactPhone).length === 0) {
            this.setState({
                formError: 'Please make sure the contact phone number is valid'
            });
            return;
        }

        this.setState(
            {
                formLoading: true,
                formError: ''
            },
            () => {
                API.createTeam(this.state.event._id, this.state.teamMembers, this.state.contactPhone)
                    .then(data => {
                        this.setState({
                            formLoading: false,
                            formSubmitted: true
                        });
                    })
                    .catch(error => {
                        console.log('ERROR', error);
                        this.setState({
                            formLoading: false,
                            formError: 'Oops, something went wrong while submitting your team. Please try again.'
                        });
                    });
            }
        );
    }

    renderEventCodeForm() {
        return (
            <div className="CreateTeam--event-code disabled">
                <TextField
                    label="Event code"
                    hint="Enter the secret code for the event you are at"
                    value={this.state.eventCode}
                    onChange={eventCode => this.setState({ eventCode })}
                    validate={Validators.noValidate}
                    required={true}
                />
                <SubmitButton text="Find Event" onClick={this.findEvent} loading={this.state.eventLoading} />
                {this.state.eventError ? (
                    <p className="CreateTeam--event-code-error">No event found with that code</p>
                ) : null}
                <div style={{ height: '50px' }} />
            </div>
        );
    }

    renderEventBanner() {
        return (
            <NonEditableTextField
                label="Event"
                value={this.state.event.name}
                onClear={() => this.setState({ event: null, eventCode: '' })}
            />
        );
    }

    renderTeamMembersForm() {
        return (
            <div className="CreateTeam--team-members">
                <div className={this.state.teamMemberError ? 'FormField has-error' : 'FormField'}>
                    <label className="FormField--label">Team members</label>
                    <div className="FormField--content-wrapper">
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
                            Add the name and email of each member of your team. You can edit these and add more team
                            members after creating the team.
                        </small>
                        <small className="FormField--error">{this.state.teamMemberError}</small>
                    </div>
                </div>
                {this.state.teamMembers.length > 0 ? (
                    <div className="FormField">
                        <label className="FormField--label" />
                        <div className="FormField--content-wrapper">
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
                                        key: 'date',
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
                        </div>
                    </div>
                ) : null}
            </div>
        );
    }

    render() {
        if (this.state.formSubmitted) {
            return (
                <div className="CreateTeam">
                    <div style={{ height: '50px' }} />
                    <h3 className="CreateTeam--submitted-title">Your team has been submitted!</h3>
                    <p className="CreateTeam--submitted-desc">
                        Each team member should soon receive their personal login link to their submitted email. With
                        that link, you can access the team dashboard and submit your project!
                    </p>
                </div>
            );
        }

        return (
            <div className="CreateTeam">
                <div style={{ height: '50px' }} />
                {!this.state.event ? this.renderEventCodeForm() : null}
                {this.state.event ? this.renderEventBanner() : null}
                <div style={{ height: '50px' }} />
                {this.state.event ? this.renderTeamMembersForm() : null}
                <div style={{ height: '50px' }} />
                {this.state.event ? (
                    <TextField
                        required={true}
                        label="Contact phone"
                        hint="Please provide a phone number where we can reach you during the event"
                        placeholder="International format (e.g. +358501234567)"
                        value={this.state.contactPhone}
                        onChange={contactPhone => this.setState({ contactPhone })}
                        validate={Validators.phoneNumber}
                    />
                ) : null}
                {this.state.event ? (
                    <SubmitButton text="Submit your team" onClick={this.onSubmit} loading={this.state.formLoading} />
                ) : null}
                {this.state.formError ? <p className="CreateTeam--form-error">{this.state.formError}</p> : null}
                <div style={{ height: '50px' }} />
            </div>
        );
    }
}

export default CreateTeam;
