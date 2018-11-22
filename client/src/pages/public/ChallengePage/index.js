import React, { Component } from 'react';
import _ from 'lodash';
import moment from 'moment-timezone';
import './style.scss';

import BannerManager from '../../../components/BannerManager';

import API from '../../../services/api';
import Utils from '../../../services/utils';
import Form from '../../../components/forms/Form';

class ChallengePage extends Component {
    constructor(props) {
        super(props);

        this.state = {
            loading: true,
            error: false,
            challengeId: this.props.match.params.challengeId,
            projects: [],
            event: null,
            winners: {
                first: null,
                second: null,
                third: null,
                comments: ''
            },
            submitLoading: false,
            winnersLoading: true,
        };

        this.submitWinners = this.submitWinners.bind(this);
    }

    componentDidMount() {
        const { secret, eventId } = this.props.match.params;

        API.getProjectsByChallenge(eventId, secret)
            .then(data => {
                this.setState({
                    challengeId: data.challengeId,
                    projects: data.projects,
                    event: data.event,
                    loading: false
                });
            })
            .catch(error => {
                this.setState({
                    loading: false,
                    error: true
                });
            });

        API.getChallengeWinners(eventId, secret)
            .then(data => {
                if (!data) {
                    throw new Error('No winners submitted');
                }
                this.setState({
                    winners: data,
                    winnersLoading: false
                })
            })
            .catch(error => {
                this.setState({
                    winnersLoading: false
                });
            })
    }

    submitWinners() {
        this.setState({
            submitLoading: true,
        }, () => {
            const { secret, eventId } = this.props.match.params;
            Utils.minDelay(API.setChallengeWinners(eventId, secret, this.state.winners), 1000).then((result) => {
                this.setState({
                    submitLoading: false,
                    winners: result
                });
                this.bannerManager.addBanner({
                    type: 'success',
                    text: 'Thanks for submitting! Your choices have been saved. If you need to, you can update your decision by submitting this form again.'
                },
                    'submit-success',
                    5000
                )
            }).catch(error => {
                this.setState({
                    submitLoading: false,
                });
                this.bannerManager.addBanner({
                    type: 'error',
                    text: 'Oops, something went wrong... Please try again.'
                },
                    'submit-error',
                    2000
                )
            });
        })
    }

    generateChallengeChoices() {
        const { projects } = this.state;

        return _.map(projects, p => {
            return {
                label: p.name,
                value: p._id,
            }
        })
    }

    renderProjects() {
        const projects = _.sortBy(this.state.projects, 'name');
        return _.map(projects, (p, index) => {
            return (
                <div className="ChallengePage--Project">
                    <h4 className="ChallengePage--Project-name">#{index + 1} - {p.name}</h4>
                    <p className="ChallengePage--Project-punchline">
                        <em>{p.punchline}</em>
                    </p>
                    <p className="ChallengePage--Project-location">
                        <strong>Table:</strong> {p.location}
                    </p>
                    <p className="ChallengePage--Project-contactPhone">
                        <strong>Phone number:</strong> <a href={'tel:' + p.contactPhone}>{p.contactPhone}</a>
                    </p>
                </div>
            );
        });
    }

    renderWinnerForm() {
        const { event, winnersLoading } = this.state;
        const now = moment().tz(event.timezone);
        const submissionDeadline = moment(event.submissionDeadline).tz(event.timezone);

        if (winnersLoading) {
            return (
                <div className="ChallengePage--loading">
                    <i className="ChallengePage--spinner fa fa-spinner fa-spin fa-2x" />
                </div>
            );
        }

        if (now.isBefore(submissionDeadline)) {
            return (
                <div className="ChallengePage--Form">
                    <div className="ChallengePage--top">
                        <h2 className="ChallengePage--title">Submit your winners</h2>
                        <p className="ChallengePage--subtitle">
                            You'll be able to submit your winners here, once the submission deadline has been reached. <br /> <br />
                            The submission deadline is {submissionDeadline.format('dddd hh:mm A')}
                        </p>
                    </div>
                </div>
            );
        } else {
            return (
                <div className="ChallengePage--Form">
                    <div className="ChallengePage--top">
                        <h2 className="ChallengePage--title">Submit your winners</h2>
                        <p className="ChallengePage--subtitle">
                            Use this form to submit the winners of this challenge
                    </p>
                        <div className="ChallengePage--separator" />
                    </div>
                    <Form
                        data={this.state.winners}
                        onChange={data => this.setState({ winners: data })}
                        onSubmit={this.submitWinners}
                        loading={this.state.submitLoading}
                        submitText="Submit"
                        fields={[
                            {
                                label: '1st Place',
                                type: 'dropdown',
                                hint: 'Which project wins your main prize?',
                                id: 'first',
                                name: 'first',
                                options: {
                                    multi: false,
                                    choices: this.generateChallengeChoices(),
                                    required: true,
                                    editable: true
                                }
                            },
                            {
                                label: '2nd Place',
                                type: 'dropdown',
                                hint: 'If you have a second place winner, choose it here',
                                id: 'second',
                                name: 'second',
                                options: {
                                    multi: false,
                                    choices: this.generateChallengeChoices(),
                                    required: false,
                                    editable: true
                                }
                            },
                            {
                                label: '3rd place',
                                type: 'dropdown',
                                hint: 'If you have a third place winner, choose it here',
                                id: 'third',
                                name: 'third',
                                options: {
                                    multi: false,
                                    choices: this.generateChallengeChoices(),
                                    required: false,
                                    editable: true
                                }
                            },
                            {
                                label: 'Comments',
                                type: 'textarea',
                                hint: 'Please write anything else you want to tell us here - such as if you have more than 3 winners, etc.',
                                placeholder: 'More than 3 winners? Anything else we should know?',
                                id: 'comments',
                                name: 'comments',
                                options: {
                                    max: 1000,
                                    editable: true
                                }
                            }
                        ]}
                    />
                    <BannerManager ref={ref => this.bannerManager = ref} />
                </div>
            );
        }
    }

    render() {
        if (this.state.loading) {
            return (
                <div className="ChallengePage">
                    <div className="ChallengePage--loading">
                        <i className="ChallengePage--spinner fa fa-spinner fa-spin fa-2x" />
                    </div>
                </div>
            );
        }

        if (this.state.error || !this.state.challengeId || !this.state.event) {
            return (
                <div className="ChallengePage">
                    <div className="ChallengePage--error">
                        <h2 className="ChallengePage--error_title">Oops, something went wrong</h2>
                        <p className="ChallengePage--error_text">
                            This is probably because your link is invalid. Please check that your link is corrent and
                            try again.
                        </p>
                    </div>
                </div>
            );
        }

        const challenge = _.find(this.state.event.challenges, (c) => c._id === this.state.challengeId);

        console.log('DATA', this.state.winners);

        return (
            <div className="ChallengePage">
                <div className="ChallengePage--top">
                    <h2 className="ChallengePage--title">{challenge.name}</h2>
                    <p className="ChallengePage--subtitle">
                        {challenge.partner}
                    </p>
                    <div className="ChallengePage--separator" />
                    <p className="ChallengePage--subtitle">
                        {this.state.projects.length} teams have submitted this challenge:
                    </p>
                </div>
                {this.renderProjects()}
                {this.renderWinnerForm()}
            </div>
        );
    }
}

export default ChallengePage;
