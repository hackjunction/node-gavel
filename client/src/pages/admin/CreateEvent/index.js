import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './style.scss';
import _ from 'lodash';
import uuid from 'uuid/v4';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import * as admin from '../../../redux/admin/selectors';

import Validators from '../../../services/validators';
import BannerManager from '../../../components/BannerManager';
import Form from '../../../components/forms/Form';

import API from '../../../services/api';

const FIELDS = [
    {
        name: 'name',
        default: ''
    },
    {
        name: 'tracks',
        default: []
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

        let eventData = {};

        if (this.props.match && this.props.match.params.id) {
            eventData._id = this.props.match.params.id;
        } else {
            eventData = this.getDefaults();
        }

        this.state = {
            eventData,
            eventLoading: false,
            eventLoadError: false,
            loading: false
        };

        this.onSubmit = this.onSubmit.bind(this);
    }

    getDefaults() {
        const eventData = {};
        _.each(FIELDS, field => {
            eventData[field.name] = field.default;
        });
        return eventData;
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
                                eventData: event,
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
        }
    }

    onSubmit() {
        const isEdit = this.state.eventData.hasOwnProperty('_id');

        this.setState(
            {
                loading: true
            },
            () => {
                API.adminCreateEvent(this.state.eventData, this.props.adminToken)
                    .then(event => {
                        this.setState({
                            loading: false,
                            eventData: event
                        });

                        this.BannerManager.addBanner(
                            {
                                type: 'success',
                                text: isEdit ? 'Changes saved!' : 'Event created succesfully!'
                            },
                            'success-banner',
                            2000
                        );
                    })
                    .catch(error => {
                        this.setState({
                            loading: false
                        });

                        this.BannerManager.addBanner(
                            {
                                type: 'error',
                                text: isEdit
                                    ? 'Oops, something went wrong - your changes were not saved'
                                    : 'Oops, something went wrong - the event was not created'
                            },
                            'error-banner',
                            2000
                        );
                    });
            }
        );
    }

    renderLoading() {
        return (
            <div className="Event--loading">
                <i className="fa fa-spinner fa-spin fa-2x" />
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
        if (this.state.eventLoading) {
            return this.renderLoading();
        }

        if (this.state.eventLoadError) {
            return this.renderError();
        }

        const { eventData } = this.state;

        return (
            <div className="AdminCreateEvent">
                <Form
                    data={eventData}
                    onChange={eventData => this.setState({ eventData })}
                    onSubmit={this.onSubmit}
                    loading={this.state.loading}
                    submitText={'Save event'}
                    fields={[
                        {
                            label: 'Event name',
                            type: 'text',
                            placeholder: 'Junction Main Event',
                            hint: 'This will be shown to participants',
                            id: 'name',
                            name: 'name',
                            options: {
                                min: 5,
                                max: 50,
                                required: true,
                                editable: true,
                            }
                        },
                        {
                            label: 'Timezone',
                            type: 'text',
                            placeholder: 'Europe/Helsinki',
                            hint:
                            'Enter a timezone for the event - see here for a list of timezones: https://en.wikipedia.org/wiki/List_of_tz_database_time_zones',
                            id: 'timezone',
                            name: 'timezone',
                            options: {
                                validate: Validators.timezone,
                                showErrorText: true,
                                editable: true,
                            }
                        },
                        {
                            label: 'Event start time',
                            type: 'date',
                            hint: 'When does the event begin?',
                            id: 'startTime',
                            name: 'startTime',
                            options: {
                                editable: true,
                            }
                        },
                        {
                            label: 'Submission deadline',
                            type: 'date',
                            hint: 'When is the submission deadline?',
                            id: 'submissionDeadline',
                            name: 'submissionDeadline',
                            options: {
                                minDate: eventData.startTime,
                                editable: true,
                            }
                        },
                        {
                            label: 'Voting start time',
                            type: 'date',
                            hint: 'When does the demo expo begin?',
                            id: 'votingStartTime',
                            name: 'votingStartTime',
                            options: {
                                minDate: eventData.submissionDeadline,
                                editable: true,
                            }
                        },
                        {
                            label: 'Voting end time',
                            type: 'date',
                            hint: 'When does the demo expo end?',
                            id: 'votingEndTime',
                            name: 'votingEndTime',
                            options: {
                                minDate: eventData.votingStartTime,
                                editable: true,
                            }
                        },
                        {
                            label: 'Event end time',
                            type: 'date',
                            hint: 'When does the event end?',
                            id: 'endTime',
                            name: 'endTime',
                            options: {
                                minDate: eventData.votingEndTime,
                                editable: true,
                            }
                        },
                        {
                            label: 'Challenges',
                            type: 'array',
                            id: 'challenges',
                            name: 'challenges',
                            options: {
                                isObject: true,
                                min: 1,
                                max: 100,
                                addText: 'Add challenge',
                                editable: true,
                                fields: [
                                    {
                                        label: 'Challenge name',
                                        type: 'text',
                                        placeholder: 'Challenge name',
                                        hint: 'What is the name of the challenge',
                                        id: 'name',
                                        name: 'name',
                                        options: {
                                            min: 3,
                                            max: 100,
                                            unique: true,
                                            required: true
                                        }
                                    },
                                    {
                                        label: 'Partner name',
                                        type: 'text',
                                        placeholder: 'Partner name',
                                        hint: 'Who issued the challenge?',
                                        id: 'partner',
                                        name: 'partner',
                                        options: {
                                            min: 2,
                                            max: 100,
                                            required: true
                                        }
                                    }
                                ]
                            }
                        },
                        {
                            label: 'Tracks',
                            type: 'array',
                            id: 'tracks',
                            name: 'tracks',
                            options: {
                                isObject: true,
                                min: 1,
                                max: 20,
                                addText: 'Add track',
                                editable: true,
                                fields: [
                                    {
                                        label: 'Track name',
                                        type: 'text',
                                        placeholder: 'Track name',
                                        hint: 'What is the name of the track?',
                                        id: 'name',
                                        name: 'name',
                                        options: {
                                            min: 3,
                                            max: 100,
                                            unique: true,
                                            required: true
                                        }
                                    }
                                ]
                            }
                        },
                        {
                            label: 'API Key',
                            type: 'text',
                            hint: 'API Key for accessing this event via the API',
                            id: 'apiKey',
                            name: 'apiKey',
                            options: {
                                min: 20,
                                max: 100,
                                required: true,
                                editable: true,
                            }
                        }
                    ]}
                />
                <BannerManager ref={ref => (this.BannerManager = ref)} />
            </div>
        );
    }
}

const mapStateToProps = state => ({
    adminToken: admin.getToken(state)
});

export default connect(mapStateToProps)(AdminCreateEvent);
