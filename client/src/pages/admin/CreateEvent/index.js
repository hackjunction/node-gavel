import React, { Component } from 'react';
import _ from 'lodash';
import moment from 'moment-timezone';
import './style.scss';

import TextField from '../../../components/forms/TextField/';
import ArrayTextField from '../../../components/forms/ArrayTextField';
import BooleanField from '../../../components/forms/BooleanField';
import SectionTitle from '../../../components/forms/SectionTitle';

const DEFAULTS = {
    name: '',
    hasTracks: false,
    tracks: [],
    hasChallenges: false,
    challenges: [],
    timezone: '',
    startTime: '',
    endTime: '',
    submissionDeadline: '',
    votingStartTime: '',
    votingEndTime: '',
    participantSecret: '',
    apiKey: '',
}

class AdminCreateEvent extends Component {

    constructor(props) {
        super(props);

        this.state = {
            eventData: DEFAULTS
        }
    }

    render() {
        return (
            <div className="AdminCreateEvent">
                <div className="form-wrapper">
                    <SectionTitle title="Basic Details" />
                    <TextField 
                        label="Event name" 
                        placeholder="JUNCTIONxBudapest" 
                        value={this.state.eventData.name}
                        onChange={(name) => this.setState({eventData: {...this.state.eventData, name}})}
                        validate={(value) => {
                            if (value.length < 5) {
                                return {
                                    error: true,
                                    message: 'Event name must be at least 5 characters'
                                }
                            } 

                            if (value.length > 50) {
                                return {
                                    error: true,
                                    message: 'Event cannot be over 50 characters'
                                }
                            }

                            return {
                                error: false,
                                meesage: ''
                            }
                        }}/>
                    <div style={{height: '100px'}}/>

                    <SectionTitle title="Tracks & Challenges"/>
                    <BooleanField
                        label="Tracks"
                        value={this.state.eventData.hasTracks}
                        text="Does the event have multiple different tracks?"
                        onChange={(hasTracks) => this.setState({eventData: {...this.state.eventData, hasTracks}})}
                    />
                    {this.state.eventData.hasTracks ? (
                        <ArrayTextField
                            label=""
                            placeholder="Track name"
                            values={this.state.eventData.tracks}
                            hint="Enter the name of each track at the hackathon"
                            onChange={(tracks) => this.setState({eventData: {...this.state.eventData, tracks}})}
                            validate={(value) => {
                                return {
                                    error: false,
                                    message: ''
                                }
                            }}
                        />
                    ) : null}
                    {this.state.eventData.hasTracks ? <div style={{height: '50px'}}/> : null}
                    <BooleanField
                        label="Challenges"
                        value={this.state.eventData.hasChallenges}
                        text="Does the event have challenges to choose from?"
                        onChange={(hasChallenges) => this.setState({eventData: {...this.state.eventData, hasChallenges}})}
                    />
                    {this.state.eventData.hasChallenges ? (
                        <ArrayTextField
                            label=""
                            placeholder="Challenge name"
                            values={this.state.eventData.challenges}
                            hint="Enter the name of each challenge at the hackathon"
                            onChange={(tracks) => this.setState({eventData: {...this.state.eventData, tracks}})}
                            validate={(value) => {
                                return {
                                    error: false,
                                    message: ''
                                }
                            }}
                        />
                    ) : null}
                    <div style={{height: '100px'}}/>
                    <SectionTitle title="Times" />
                    <TextField 
                        label="Timezone" 
                        placeholder="Europe/Helsinki" 
                        value={this.state.eventData.timezone}
                        hint="Enter a timezone for the event - this is important as it affects when the platform accepts submissions and votes. See a list of valid timezones here: https://en.wikipedia.org/wiki/List_of_tz_database_time_zones" 
                        onChange={(timezone) => this.setState({eventData: {...this.state.eventData, timezone}})}
                        validate={(value) => {
                            if (!moment.tz.zone(value)) {
                                return {
                                    error: true,
                                    message: 'Please enter a valid timezone (e.g. Europe/Helsinki)'
                                }
                            } else {
                                return {
                                    error: false,
                                    message: ''
                                }
                            }
                        }}
                    />
                    <TextField 
                        label="Event start time" 
                        placeholder="dd.mm.yyyy HH:mm" 
                        value={this.state.eventData.startTime}
                        hint="When does the event begin?"
                        onChange={(startTime) => this.setState({eventData: {...this.state.eventData, startTime}})}
                        validate={(value) => {
                            const mom = moment(value, 'DD.MM.YYYY HH:mm');
                            if (!mom.isValid()) {
                                return {
                                    error: true,
                                    message: 'Please enter the date and time as dd.mm.yyyy HH:mm'
                                };
                            } else {
                                return {
                                    error: false,
                                    message: mom.format('MMMM Do YYYY, HH:mm')
                                }
                            }
                        }}
                    />
                    <TextField 
                        label="Event end time" 
                        placeholder="dd.mm.yyyy HH:mm" 
                        value={this.state.eventData.endTime}
                        hint="When does the event end?"
                        onChange={(endTime) => this.setState({eventData: {...this.state.eventData, endTime}})} 
                        validate={(value) => {
                            const mom = moment(value, 'DD.MM.YYYY HH:mm');
                            if (!mom.isValid()) {
                                return {
                                    error: true,
                                    message: 'Please enter the date and time as dd.mm.yyyy HH:mm'
                                };
                            } else {
                                const startTime = moment(this.state.eventData.startTime, 'DD.MM.YYYY HH:mm');

                                if (startTime.isValid()) {
                                    if (!startTime.isBefore(mom)) {
                                        return {
                                            error: true,
                                            message: 'Event end time must be after the event start time!'
                                        }
                                    }
                                }

                                return {
                                    error: false,
                                    message: mom.format('MMMM Do YYYY, HH:mm')
                                }
                            }
                        }}
                    />
                    <TextField 
                        label="Submission deadline" 
                        placeholder="dd.mm.yyyy HH:mm" 
                        value={this.state.eventData.submissionDeadline}
                        hint="When does the platform no longer accept project submissions?"
                        onChange={(submissionDeadline) => this.setState({eventData: {...this.state.eventData, submissionDeadline}})}
                        validate={(value) => {
                            const mom = moment(value, 'DD.MM.YYYY HH:mm');
                            if (!mom.isValid()) {
                                return {
                                    error: true,
                                    message: 'Please enter the date and time as dd.mm.yyyy HH:mm'
                                };
                            } else {
                                const startTime = moment(this.state.eventData.startTime, 'DD.MM.YYYY HH:mm');

                                if (startTime.isValid()) {
                                    if (!startTime.isBefore(mom)) {
                                        return {
                                            error: true,
                                            message: 'Submission deadline must be after the event begins'
                                        }
                                    }
                                }

                                const endTime = moment(this.state.eventData.endTime, 'DD.MM.YYYY HH:mm');

                                if (endTime.isValid()) {
                                    if (!endTime.isAfter(mom)) {
                                        return {
                                            error: true,
                                            message: 'Submission deadline must be before the event ends'
                                        }
                                    }
                                }

                                return {
                                    error: false,
                                    message: mom.format('MMMM Do YYYY, HH:mm')
                                }
                            }
                        }}
                    />
                    <TextField 
                        label="Voting begins" 
                        placeholder="dd.mm.yyyy HH:mm" 
                        value={this.state.eventData.votingStartTime} 
                        hint="When does the judging period begin?"
                        onChange={(votingStartTime) => this.setState({eventData: {...this.state.eventData, votingStartTime}})}
                        validate={(value) => {
                            const mom = moment(value, 'DD.MM.YYYY HH:mm');
                            if (!mom.isValid()) {
                                return {
                                    error: true,
                                    message: 'Please enter the date and time as dd.mm.yyyy HH:mm'
                                };
                            } else {
                                const submissionDeadline = moment(this.state.eventData.submissionDeadline, 'DD.MM.YYYY HH:mm');

                                if (submissionDeadline.isValid()) {
                                    if (!submissionDeadline.isBefore(mom)) {
                                        return {
                                            error: true,
                                            message: 'Voting cannot begin before the submission deadline'
                                        }
                                    }
                                }

                                const endTime = moment(this.state.eventData.endTime, 'DD.MM.YYYY HH:mm');

                                if (endTime.isValid()) {
                                    if (!endTime.isAfter(mom)) {
                                        return {
                                            error: true,
                                            message: 'Voting must start before the event ends!'
                                        }
                                    }
                                }

                                return {
                                    error: false,
                                    message: mom.format('MMMM Do YYYY, HH:mm')
                                }
                            }
                        }}
                    />
                    <TextField 
                        label="Voting ends" 
                        placeholder="dd.mm.yyyy HH:mm" 
                        value={this.state.eventData.votingEndTime}
                        hint="When does the judging period end?"
                        onChange={(votingEndTime) => this.setState({eventData: {...this.state.eventData, votingEndTime}})} 
                        validate={(value) => {
                            const mom = moment(value, 'DD.MM.YYYY HH:mm');
                            if (!mom.isValid()) {
                                return {
                                    error: true,
                                    message: 'Please enter the date and time as dd.mm.yyyy HH:mm'
                                };
                            } else {
                                const votingStartTime = moment(this.state.eventData.votingStartTime, 'DD.MM.YYYY HH:mm');

                                if (votingStartTime.isValid()) {
                                    if (!votingStartTime.isBefore(mom)) {
                                        return {
                                            error: true,
                                            message: 'Voting end time must be after voting start time'
                                        }
                                    }
                                }

                                const endTime = moment(this.state.eventData.endTime, 'DD.MM.YYYY HH:mm');

                                if (endTime.isValid()) {
                                    if (!endTime.isAfter(mom)) {
                                        return {
                                            error: true,
                                            message: 'Voting must end before the event ends!'
                                        }
                                    }
                                }

                                return {
                                    error: false,
                                    message: mom.format('MMMM Do YYYY, HH:mm')
                                }
                            }
                        }}
                    />
                </div>
                <div style={{height: '100px'}}/>
                 <SectionTitle title="Access" />
                 <TextField 
                        label="Participant Secret" 
                        placeholder="At least 10 characters" 
                        hint="The secret code with which participants are able to create teams and submit projects to this event"
                        value={this.state.eventData.participantSecret}
                        onChange={(participantSecret) => this.setState({eventData: {...this.state.eventData, participantSecret}})}
                        validate={(value) => {
                            if (value.length < 10) {
                                return {
                                    error: true,
                                    message: 'The secret must be at least 10 characters'
                                }
                            } 

                            if (value.length > 50) {
                                return {
                                    error: true,
                                    message: 'The secret must be max 50 characters'
                                }
                            }

                            return {
                                error: false,
                                meesage: ''
                            }
                        }}/>
                    <TextField 
                        label="API Key" 
                        placeholder="At least 24 characters" 
                        hint="A secret key with which you can access the API of this event"
                        value={this.state.eventData.apiKey}
                        onChange={(apiKey) => this.setState({eventData: {...this.state.eventData, apiKey}})}
                        validate={(value) => {
                            if (value.length < 24) {
                                return {
                                    error: true,
                                    message: 'The API key must be at least 24 characters'
                                }
                            } 

                            if (value.length > 50) {
                                return {
                                    error: true,
                                    message: 'The API key must be max 50 characters'
                                }
                            }

                            return {
                                error: false,
                                meesage: ''
                            }
                        }}/>
            </div>
        );
    }
}

export default AdminCreateEvent;
