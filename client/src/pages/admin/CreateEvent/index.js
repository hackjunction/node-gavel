import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './style.scss';
import _ from 'lodash';
import uuid from 'uuid/v4';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import * as admin from '../../../redux/admin/selectors';

import Validators from '../../../services/validators';

import TextField from '../../../components/forms/TextField/';
import ArrayTextField from '../../../components/forms/ArrayTextField';
import BooleanField from '../../../components/forms/BooleanField';
import SectionTitle from '../../../components/forms/SectionTitle';
import SubmitButton from '../../../components/forms/SubmitButton';
import ErrorsBox from '../../../components/forms/ErrorsBox';

import API from '../../../services/api';
import moment from 'moment-timezone';

const DATE_FORMAT = 'DD.MM.YYYY HH:mm';

const FIELDS = [
    {
        name: 'name',
        default: ''
    },
    {
        name: 'hasTracks',
        default: false
    },
    {
        name: 'tracks',
        default: []
    },
    {
        name: 'hasChallenges',
        default: false
    },
    {
        name: 'challenges',
        default: []
    },
    {
        name: 'timezone',
        default: ''
    },
    {
        name: 'startTime',
        default: ''
    },
    {
        name: 'endTime',
        default: ''
    },
    {
        name: 'submissionDeadline',
        default: ''
    },
    {
        name: 'votingStartTime',
        default: ''
    },
    {
        name: 'votingEndTime',
        default: ''
    },
    {
        name: 'participantCode',
        default: ''
    },
    {
        name: 'apiKey',
        default: uuid()
    }
];

class AdminCreateEvent extends Component {
    static propTypes = {
        adminToken: PropTypes.string.isRequired
    };

    constructor(props) {
        super(props);

        const eventData = {};

        if (this.props.match && this.props.match.params.id) {
            eventData._id = this.props.match.params.id;
        }

        this.state = {
            eventData,
            loading: false,
            error: false,
            submittedEvent: null,
            errors: [],
            eventLoadError: false,
            eventLoading: false
        };

        this.onSubmit = this.onSubmit.bind(this);
    }

    componentDidMount() {
        if (this.state.eventData.hasOwnProperty('_id')) {
            this.setState(
                {
                    eventLoading: true
                },
                () => {
                    API.adminGetEvent(this.props.adminToken, this.state.eventData._id)
                        .then(event => {
                            this.setState({
                                eventData: {
                                    ...this.state.eventData,
                                    ...event,
                                    startTime: moment(event.startTime)
                                        .tz(event.timezone)
                                        .format(DATE_FORMAT),
                                    endTime: moment(event.endTime)
                                        .tz(event.timezone)
                                        .format(DATE_FORMAT),
                                    submissionDeadline: moment(event.submissionDeadline)
                                        .tz(event.timezone)
                                        .format(DATE_FORMAT),
                                    votingStartTime: moment(event.votingStartTime)
                                        .tz(event.timezone)
                                        .format(DATE_FORMAT),
                                    votingEndTime: moment(event.votingEndTime)
                                        .tz(event.timezone)
                                        .format(DATE_FORMAT)
                                },
                                eventLoading: false
                            });
                        })
                        .catch(error => {
                            this.setState({
                                eventLoading: false,
                                eventLoadError: true
                            });
                        });
                }
            );
        } else {
            const eventData = {};
            _.each(FIELDS, field => {
                eventData[field.name] = field.default;
            });

            this.setState({
                eventData
            });
        }
    }

    onSubmit() {
        let hasError = false;
        const errors = _.map(FIELDS, field => {
            if (this[field.name]) {
                const data = this[field.name].isValid();
                if (data.error) {
                    hasError = true;
                }
                return data;
            } else {
                return {
                    error: false,
                    message: ''
                };
            }
        });
        if (hasError) {
            const filtered = _.filter(errors, e => e.error);
            this.setState({
                errors: filtered
            });
        } else {
            this.setState(
                {
                    errors: [],
                    error: false,
                    loading: true
                },
                () => {
                    API.adminCreateEvent(this.state.eventData, this.props.adminToken)
                        .then(event => {
                            this.setState({
                                loading: false,
                                submittedEvent: event
                            });
                        })
                        .catch(error => {
                            this.setState({
                                loading: false,
                                error: true
                            });
                        });
                }
            );
        }
    }

    renderSubmitted() {
        return (
            <div className="Event--submitted">
                <h3 className="Event--submitted-title">Event submitted!</h3>
                <Link to="/admin">Back to event list</Link>
            </div>
        );
    }

    renderError() {
        return (
            <div className="Event--submitted">
                <h3 className="Event--submitted-title">Unable to get event</h3>
                <p>Unable to get the event with the id {this.state.eventData._id}. Reload this page to try again.</p>
                <Link to="/admin">Back to event list</Link>
            </div>
        );
    }

    render() {
        if (this.state.submittedEvent) {
            return this.renderSubmitted();
        }

        if (this.state.eventLoadError) {
            return this.renderError();
        }

        return (
            <div className="AdminCreateEvent">
                <div className="form-wrapper">
                    <SectionTitle title="Basic Details" />
                    <TextField
                        ref={ref => (this.name = ref)}
                        label="Event name"
                        placeholder="JUNCTIONxBudapest"
                        value={this.state.eventData.name}
                        onChange={name => this.setState({ eventData: { ...this.state.eventData, name } })}
                        required={true}
                        validate={value =>
                            Validators.stringMinMax(
                                value,
                                5,
                                50,
                                'Event name must be at least 5 characters',
                                'Event name cannot be over 50 characters'
                            )
                        }
                    />
                    <div style={{ height: '100px' }} />

                    <SectionTitle title="Tracks & Challenges" />
                    <BooleanField
                        ref={ref => (this.hasTracks = ref)}
                        label="Has tracks?"
                        value={this.state.eventData.hasTracks}
                        text="Does the event have multiple different tracks?"
                        onChange={hasTracks => this.setState({ eventData: { ...this.state.eventData, hasTracks } })}
                    />
                    {this.state.eventData.hasTracks ? (
                        <ArrayTextField
                            ref={ref => (this.tracks = ref)}
                            label="Tracks"
                            placeholder="Track name"
                            values={this.state.eventData.tracks}
                            hint="Enter the name of each track at the hackathon"
                            onChange={tracks => this.setState({ eventData: { ...this.state.eventData, tracks } })}
                            required={this.state.eventData.hasTracks}
                            validateItem={value =>
                                Validators.stringMinMax(
                                    value,
                                    2,
                                    100,
                                    'The track name must be at least 2 characters',
                                    'The track name must be under 100 characters'
                                )
                            }
                            minItems={2}
                            minItemsMessage="If your event uses tracks, it must have at least two tracks!"
                            maxItems={20}
                            maxItemsMessage="The maximum amount of tracks is 20"
                            unique={true}
                            uniqueMessage="You've already added a track with that name"
                        />
                    ) : null}
                    {this.state.eventData.hasTracks ? <div style={{ height: '50px' }} /> : null}
                    <BooleanField
                        ref={ref => (this.hasChallenges = ref)}
                        label="Has challenges?"
                        value={this.state.eventData.hasChallenges}
                        text="Does the event have challenges to choose from?"
                        onChange={hasChallenges =>
                            this.setState({ eventData: { ...this.state.eventData, hasChallenges } })
                        }
                    />
                    {this.state.eventData.hasChallenges ? (
                        <ArrayTextField
                            ref={ref => (this.challenges = ref)}
                            label="Challenges"
                            placeholder="Challenge name"
                            values={this.state.eventData.challenges}
                            hint="Enter the name of each challenge at the hackathon"
                            onChange={challenges =>
                                this.setState({ eventData: { ...this.state.eventData, challenges } })
                            }
                            required={this.state.eventData.hasChallenges}
                            validateItem={value =>
                                Validators.stringMinMax(
                                    value,
                                    2,
                                    100,
                                    'The challenge name must be at least 2 characters',
                                    'The challenge name must be under 100 characters'
                                )
                            }
                            minItems={1}
                            minItemsMessage="If your event uses challenges, it must have at least one!"
                            maxItems={200}
                            maxItemsMessage="The maximum amount of challenges is 200"
                            unique={true}
                            uniqueMessage="You've already added a challenge with that name"
                        />
                    ) : null}
                    <div style={{ height: '100px' }} />
                    <SectionTitle title="Times" />
                    <TextField
                        ref={ref => (this.timezone = ref)}
                        label="Timezone"
                        placeholder="Europe/Helsinki"
                        value={this.state.eventData.timezone}
                        hint="Enter a timezone for the event - see here for a list of timezones: https://en.wikipedia.org/wiki/List_of_tz_database_time_zones"
                        onChange={timezone => this.setState({ eventData: { ...this.state.eventData, timezone } })}
                        validate={Validators.timezone}
                        required={true}
                    />
                    <TextField
                        ref={ref => (this.startTime = ref)}
                        label="Event start time"
                        placeholder={DATE_FORMAT}
                        value={this.state.eventData.startTime}
                        hint="When does the event begin?"
                        onChange={startTime => this.setState({ eventData: { ...this.state.eventData, startTime } })}
                        validate={Validators.date}
                        required={true}
                    />
                    <TextField
                        ref={ref => (this.endTime = ref)}
                        label="Event end time"
                        placeholder={DATE_FORMAT}
                        value={this.state.eventData.endTime}
                        hint="When does the event end?"
                        onChange={endTime => this.setState({ eventData: { ...this.state.eventData, endTime } })}
                        validate={value =>
                            Validators.dateMinMax(
                                value,
                                this.state.eventData.startTime,
                                null,
                                'Event end time must be after the event start time!',
                                null
                            )
                        }
                        required={true}
                    />
                    <TextField
                        ref={ref => (this.submissionDeadline = ref)}
                        label="Submission deadline"
                        placeholder={DATE_FORMAT}
                        value={this.state.eventData.submissionDeadline}
                        hint="When does the platform no longer accept project submissions?"
                        onChange={submissionDeadline =>
                            this.setState({ eventData: { ...this.state.eventData, submissionDeadline } })
                        }
                        validate={value =>
                            Validators.dateMinMax(
                                value,
                                this.state.eventData.startTime,
                                this.state.eventData.endTime,
                                'Submission deadline must be after the event begins',
                                'Submission deadline must be before the event ends'
                            )
                        }
                        required={true}
                    />
                    <TextField
                        ref={ref => (this.votingStartTime = ref)}
                        label="Voting begins"
                        placeholder={DATE_FORMAT}
                        value={this.state.eventData.votingStartTime}
                        hint="When does the judging period begin?"
                        onChange={votingStartTime =>
                            this.setState({ eventData: { ...this.state.eventData, votingStartTime } })
                        }
                        validate={value =>
                            Validators.dateMinMax(
                                value,
                                this.state.eventData.submissionDeadline,
                                this.state.eventData.endTime,
                                'Voting cannot begin before the submission deadline',
                                'Voting must start before the event ends!'
                            )
                        }
                        required={true}
                    />
                    <TextField
                        ref={ref => (this.votingEndTime = ref)}
                        label="Voting ends"
                        placeholder={DATE_FORMAT}
                        value={this.state.eventData.votingEndTime}
                        hint="When does the judging period end?"
                        onChange={votingEndTime =>
                            this.setState({ eventData: { ...this.state.eventData, votingEndTime } })
                        }
                        validate={value =>
                            Validators.dateMinMax(
                                value,
                                this.state.eventData.votingStartTime,
                                this.state.eventData.endTime,
                                'Voting end time must be after voting start time',
                                'Voting must end before the event ends!'
                            )
                        }
                        required={true}
                    />
                    <div style={{ height: '50px' }} />
                    <SectionTitle title="Access" />
                    <TextField
                        ref={ref => (this.participantCode = ref)}
                        label="Participant code"
                        placeholder="my-secret-key"
                        value={this.state.eventData.participantCode}
                        hint="A secret code with which participants can register for the event"
                        onChange={participantCode =>
                            this.setState({ eventData: { ...this.state.eventData, participantCode } })
                        }
                        validate={value =>
                            Validators.stringMinMax(
                                value,
                                16,
                                50,
                                'The participant code must be at least 16 characters',
                                'The participant code must be at most 50 characters'
                            )
                        }
                        required={true}
                    />
                    <TextField
                        ref={ref => (this.apiKey = ref)}
                        label="API Key"
                        placeholder=""
                        value={this.state.eventData.apiKey}
                        hint="API key for accessing this event via the API"
                        onChange={apiKey => {
                            this.setState({ eventData: { ...this.state.eventData, apiKey } });
                        }}
                        validate={value =>
                            Validators.stringMinMax(
                                value,
                                16,
                                50,
                                'The API key must be at least 16 characters',
                                'The API key can be at most 50 characters'
                            )
                        }
                        required={true}
                    />
                </div>
                <ErrorsBox errors={this.state.errors} />
                <div style={{ height: '100px' }} />
                <SubmitButton
                    text={this.state.eventData._id ? 'Update Event' : 'Create Event'}
                    loading={this.state.loading}
                    disabled={false /** TODO:! */}
                    onClick={this.onSubmit}
                />
                <div style={{ height: '50px' }} />
                {this.state.error ? <p className="CreateEvent--error">Oops, something went wrong</p> : null}
            </div>
        );
    }
}

const mapStateToProps = state => ({
    adminToken: admin.getToken(state)
});

export default connect(mapStateToProps)(AdminCreateEvent);
