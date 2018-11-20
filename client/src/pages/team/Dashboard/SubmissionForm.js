import React, { Component } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';

import TextField from '../../../components/forms/TextField';
import TextArea from '../../../components/forms/TextArea';
import DropDown from '../../../components/forms/DropDown';
import SubmitButton from '../../../components/forms/SubmitButton';
import BannerManager from '../../../components/BannerManager';

import Validators from '../../../services/validators';

import * as UserActions from '../../../redux/user/actions';
import * as user from '../../../redux/user/selectors';

import Form from '../../../components/forms/Form';

class SubmissionForm extends Component {
    constructor(props) {
        super(props);

        this.state = {
            submission: {}
        };

        this.addBanner = this.addBanner.bind(this);
        this.saveSubmission = this.saveSubmission.bind(this);
    }

    addBanner() {
        this.bannerManager.addBanner(
            {
                type: 'success',
                text: 'Your submission was updated!',
                canClose: true
            },
            Date.now(),
            2000
        );
    }

    saveSubmission() {
        const { submission, saveSubmission } = this.props;
        const { secret } = this.props.user;

        this.setState(
            {
                loading: true
            },
            () => {
                saveSubmission(submission, secret)
                    .then(() => {
                        this.bannerManager.addBanner(
                            {
                                type: 'success',
                                text: 'Your submission was updated!',
                                canClose: true
                            },
                            Date.now(),
                            2000
                        );

                        this.setState({
                            loading: false
                        });
                    })
                    .catch(() => {
                        this.bannerManager.addBanner(
                            {
                                type: 'error',
                                text: "Something went wrong - your changes weren't saved",
                                canClose: true
                            },
                            Date.now()
                        );

                        this.setState({
                            loading: false
                        });
                    });
            }
        );
    }

    generateChallengeChoices() {
        const { challenges } = this.props.event;

        return _.map(challenges, c => {
            return {
                value: c,
                label: c
            };
        });
    }

    generateTrackChoices() {
        const { tracks } = this.props.event;

        return _.map(tracks, t => {
            return {
                value: t,
                label: t
            };
        });
    }

    generateTableNumbers() {
        const letters = ['A', 'B', 'C', 'D', 'E', 'F', 'H', 'I', 'J', 'K', 'X'];
        const options = [];

        _.each(letters, letter => {
            for (let i = 0; i < 30; i++) {
                const tableNumber = letter + (i + 1);
                options.push({
                    value: tableNumber,
                    label: tableNumber
                });
            }
        });

        return options;
    }

    renderTopText() {
        const { isSubmissionsOpen, submissionDeadline } = this.props;
        if (isSubmissionsOpen()) {
            return (
                <p>
                    You should submit a draft of your project as soon as you have a rough idea of what you're working on
                    - you can always edit your submission until the submission deadline,{' '}
                    <strong>{submissionDeadline.format('dddd HH:mm A')}</strong>
                </p>
            );
        } else {
            return (
                <p>
                    <strong>Submissions are now closed</strong>. You can still edit some fields of your location, such
                    as your table location.
                </p>
            );
        }
    }

    render() {
        const { submission, setSubmission } = this.props;

        return (
            <div className="SubmissionForm">
                <h4>Project Submission</h4>
                <Form
                    data={submission}
                    onChange={setSubmission}
                    onSubmit={this.saveSubmission}
                    loading={this.state.loading}
                    submitText={'Save submission'}
                    checkboxes={[
                        {
                            id: 'rules',
                            required: true,
                            defaultValue: submission.hasOwnProperty('_id'),
                            render: () => (
                                <p>
                                    I have read and confirm that my submission does not break any of the{' '}
                                    <a
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        href="https://live.hackjunction.com/rules/"
                                    >
                                        Competition Rules
                                    </a>
                                    {'. '}
                                </p>
                            )
                        },
                        {
                            id: 'privacy',
                            required: true,
                            defaultValue: submission.hasOwnProperty('_id'),
                            render: () => (
                                <p>
                                    I have read and agree to the updated{' '}
                                    <a target="_blank" rel="noopener noreferrer" href="https://hackjunction.com/policy">
                                        Privacy Policy
                                    </a>{' '}
                                    and{' '}
                                    <a target="_blank" rel="noopener noreferrer" href="https://hackjunction.com/terms">
                                        Terms & Conditions
                                    </a>{' '}
                                    , especially as it relates to how we handle your submission data, how we use it
                                    (e.g. marketing), who we share it with (e.g. event partners), and what your rights
                                    are related to the submission data.
                                </p>
                            )
                        }
                    ]}
                    fields={[
                        {
                            label: 'Project name',
                            type: 'text',
                            placeholder: 'A catchy name for your project',
                            id: 'name',
                            name: 'name',
                            options: {
                                min: 2,
                                max: 100,
                                required: true
                            }
                        },
                        {
                            label: 'Punchline',
                            type: 'text',
                            placeholder: 'A short punchline',
                            hint: 'In one sentence, what is your project all about?',
                            id: 'punchline',
                            name: 'punchline',
                            options: {
                                min: 10,
                                max: 100,
                                required: true
                            }
                        },
                        {
                            label: 'Description',
                            type: 'textarea',
                            placeholder: 'A longer description of all the juicy details',
                            hint:
                                'What problem does your project solve? What tech did you use? What else do you want to tell us about it?',
                            id: 'description',
                            name: 'description',
                            options: {
                                min: 0,
                                max: 2000
                            }
                        },
                        {
                            label: 'Source Code',
                            type: 'text',
                            placeholder: 'Github, BitBucket etc...',
                            hint:
                                'As per the submission rules, we require all teams to submit a link to their source code. If you do not wish to have your code openly accessible, please upload it as a .zip file to e.g. Google Drive, and paste a link which allows us to access it.',
                            id: 'source',
                            name: 'source',
                            options: {
                                required: true,
                                validate: Validators.url,
                                showErrorText: true
                            }
                        },
                        {
                            label: 'Open source?',
                            type: 'boolean',
                            hint: 'If no, the link to your source code will not be visible to the public',
                            id: 'source_public',
                            name: 'source_public',
                            options: {
                                default: true
                            }
                        },
                        {
                            label: 'Show team members',
                            type: 'boolean',
                            hint: 'If no, team members will be shown as anonymous in the project gallery',
                            id: 'members_public',
                            name: 'members_public',
                            options: {
                                default: true
                            }
                        },
                        {
                            label: 'Table Location',
                            type: 'dropdown',
                            hint: 'What is the nearest table location to you?',
                            id: 'location',
                            name: 'location',
                            options: {
                                multi: false,
                                choices: this.generateTableNumbers(),
                                required: true
                            }
                        },
                        {
                            label: 'Track',
                            type: 'dropdown',
                            hint: 'What track are you participating on?',
                            id: 'track',
                            name: 'track',
                            options: {
                                multi: false,
                                choices: this.generateTrackChoices(),
                                required: true
                            }
                        },
                        {
                            label: 'Challenges',
                            type: 'dropdown',
                            hint: 'What challenges did you complete?',
                            id: 'challenges',
                            name: 'challenges',
                            options: {
                                multi: true,
                                choices: this.generateChallengeChoices(),
                                min: 1,
                                max: 5,
                                required: true
                            }
                        },
                        {
                            label: 'Contact Phone',
                            type: 'text',
                            placeholder: 'International format, e.g. +358501234567',
                            hint:
                                'This will only be used in case we need to contact you during the event, and not for any other purpose.',
                            id: 'contactPhone',
                            name: 'contactPhone',
                            options: {
                                validate: Validators.phoneNumber,
                                showErrorText: true,
                                required: true
                            }
                        }
                    ]}
                />
                <BannerManager ref={ref => (this.bannerManager = ref)} />
            </div>
        );
    }
}

const mapStateToProps = state => ({
    user: user.getUser(state),
    submissionLoading: user.isSubmissionLoading(state),
    submissionError: user.isSubmissionError(state),
    submission: user.getSubmission(state),
    eventLoading: user.isEventLoading(state),
    eventError: user.isEventError(state),
    event: user.getEvent(state),
    submissionDeadline: user.getSubmissionDeadline(state),
    isSubmissionsOpen: user.isSubmissionsOpen(state)
});

const mapDispatchToProps = dispatch => ({
    fetchSubmission: secret => dispatch(UserActions.fetchSubmission(secret)),
    fetchEvent: secret => dispatch(UserActions.fetchEvent(secret)),
    setSubmission: submission => dispatch(UserActions.setSubmission(submission)),
    saveSubmission: (submission, secret) => dispatch(UserActions.saveSubmission(submission, secret, 1000))
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(SubmissionForm);
