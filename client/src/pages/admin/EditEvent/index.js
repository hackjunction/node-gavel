import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './style.scss';
import _ from 'lodash';
import uuid from 'uuid/v4';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import moment from 'moment-timezone';

import * as AdminActions from '../../../redux/admin/actions';
import * as admin from '../../../redux/admin/selectors';

import Validators from '../../../services/validators';

import TextField from '../../../components/forms/TextField/';
import ArrayTextField from '../../../components/forms/ArrayTextField';
import BooleanField from '../../../components/forms/BooleanField';
import SectionTitle from '../../../components/forms/SectionTitle';
import SubmitButton from '../../../components/forms/SubmitButton';
import ErrorsBox from '../../../components/forms/ErrorsBox';

import API from '../../../services/api';

const FIELDS = [
    {
        name: 'name',
        default: 'JUNCTIONxBudapest'
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
        default: true
    },
    {
        name: 'challenges',
        default: ['Challenge 1', 'Challenge 2', 'Challenge 3']
    },
    {
        name: 'timezone',
        default: 'Europe/Helsinki'
    },
    {
        name: 'startTime',
        default: '01.11.2018 16:00'
    },
    {
        name: 'endTime',
        default: '01.11.2018 23:00'
    },
    {
        name: 'submissionDeadline',
        default: '01.11.2018 18:00'
    },
    {
        name: 'votingStartTime',
        default: '01.11.2018 19:00'
    },
    {
        name: 'votingEndTime',
        default: '01.11.2018 20:00'
    },
    {
        name: 'participantCode',
        default: 'super-secret-budapest'
    },
    {
        name: 'apiKey',
        default: uuid()
    }
];

class AdminEditEvent extends Component {
    static propTypes = {
        adminToken: PropTypes.string.isRequired,
        match: PropTypes.any
    };

    componentDidMount() {
      API.adminGetEventByID(this.props.adminToken, this.props.match.params.id)
        .then((data) => {
          data.startTime = moment(data.startTime).format('DD.MM.YYYY HH:mm')
          data.endTime = moment(data.endTime).format('DD.MM.YYYY HH:mm')
          data.submissionDeadline = moment(data.submissionDeadline).format('DD.MM.YYYY HH:mm')
          data.votingStartTime = moment(data.votingStartTime).format('DD.MM.YYYY HH:mm')
          data.votingEndTime = moment(data.votingEndTime).format('DD.MM.YYYY HH:mm')
          this.setState({
            eventData: data
          })
        })
    }

    constructor(props) {
        super(props);

        console.log(props)

        const eventData = {}

        _.each(FIELDS, field => {
            eventData[field.name] = field.default;
        });

        this.state = {
            eventData,
            loading: false,
            error: false,
            submittedEvent: null,
            errors: []
        };

        this.onSubmit = this.onSubmit.bind(this);
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
                    API.adminEditEvent(this.state.eventData, this.props.adminToken)
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
                <h3 className="Event--submitted-title">Event updated!</h3>
                <Link to="/admin">Back to event list</Link>
            </div>
        );
    }

    render() {
        if (this.state.submittedEvent) {
            return this.renderSubmitted();
        }

        return (
            <div className="AdminEditEvent">
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
                        placeholder="dd.mm.yyyy HH:mm"
                        value={this.state.eventData.startTime}
                        hint="When does the event begin?"
                        onChange={startTime => this.setState({ eventData: { ...this.state.eventData, startTime } })}
                        validate={Validators.date}
                        required={true}
                    />
                    <TextField
                        ref={ref => (this.endTime = ref)}
                        label="Event end time"
                        placeholder="dd.mm.yyyy HH:mm"
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
                        placeholder="dd.mm.yyyy HH:mm"
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
                        placeholder="dd.mm.yyyy HH:mm"
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
                        placeholder="dd.mm.yyyy HH:mm"
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
                <SubmitButton text="Edit Event" loading={this.state.loading} onClick={this.onSubmit} />
                <div style={{ height: '50px' }} />
                {this.state.error ? <p className="EditEvent--error">Oops, something went wrong</p> : null}
            </div>
        );
    }
}

const mapStateToProps = state => ({
    adminToken: admin.getToken(state)
});

export default connect(mapStateToProps)(AdminEditEvent);
