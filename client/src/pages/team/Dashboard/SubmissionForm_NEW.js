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
            });
    }

    tableOptions() {
        const letters = ['A', 'B', 'C', 'D', 'E', 'F', 'H', 'I', 'J', 'K', 'X'];
        const options = [];

        _.each(letters, letter => {
            for (let i = 0; i < 30; i++) {
                options.push(letter + (i + 1));
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
        const { submission, editSubmission, event } = this.props;

        console.log('SUB', this.state.submission);

        return (
            <div className="SubmissionForm">
                <h4>Project Submission</h4>
                <Form
                    data={this.state.submission}
                    onChange={submission => this.setState({ submission })}
                    fields={[
                        {
                            label: 'Project name',
                            type: 'text',
                            placeholder: 'A catchy name for your project',
                            id: 'name',
                            name: 'name',
                            options: {
                                min: 2,
                                max: 100
                            }
                        },
                        {
                            label: 'Punchline',
                            type: 'text',
                            placeholder: 'A short punchline to describe your project',
                            id: 'punchline',
                            name: 'punchline',
                            options: {
                                min: 10,
                                max: 100
                            }
                        },
                        {
                            label: 'Description',
                            type: 'textarea',
                            placeholder:
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
                            placeholder: 'A link to your source code on GitHub, BitBucket, etc.',
                            id: 'source',
                            name: 'source'
                        },
                        {
                            label: 'Table Location',
                            type: 'dropdown',
                            placeholder: 'What is the nearest table location to you?',
                            id: 'location',
                            name: 'location',
                            options: {
                                multi: false,
                                choices: ['A1', 'A2', 'A3']
                            }
                        },
                        {
                            label: 'Track',
                            type: 'dropdown',
                            placeholder: 'What track are you participating on?',
                            id: 'track',
                            name: 'track'
                        },
                        {
                            label: 'Challenges',
                            type: 'dropdown',
                            placeholder: 'What challenges did you complete?',
                            id: 'challenges',
                            name: 'challenges'
                        },
                        {
                            label: 'Contact Phone',
                            type: 'text',
                            placeholder: 'A phone number where we will be able to reach you',
                            id: 'contactPhone',
                            name: 'contactPhone'
                        }
                    ]}
                />

                {/* {this.renderTopText()}
                <BannerManager banners={[]} ref={ref => (this.bannerManager = ref)} />
                <TextField
                    ref={ref => (this.submissionName = ref)}
                    label={'Project name'}
                    placeholder="A catchy name for your project"
                    value={submission.name || ''}
                    onChange={name => {
                        editSubmission('name', name);
                    }}
                    required={true}
                    validate={value =>
                        Validators.stringMinMax(
                            value,
                            5,
                            50,
                            'Project name must be at least 5 characters',
                            'Project name cannot be over 50 characters'
                        )
                    }
                />
                <TextField
                    ref={ref => (this.submissionPunchline = ref)}
                    label="Punchline"
                    placeholder="A short punchline about your project"
                    value={submission.punchline || ''}
                    onChange={punchline => {
                        editSubmission('punchline', punchline);
                    }}
                    required={true}
                    validate={value =>
                        Validators.stringMinMax(
                            value,
                            1,
                            100,
                            'Your punchline must be at least 1 character',
                            'Your punchline cannot be over 100 characters'
                        )
                    }
                />
                <TextArea
                    ref={ref => (this.submissionDescription = ref)}
                    label="Description"
                    placeholder="What problem does your project solve? What tech did you use? What else do you want to tell us about it?"
                    value={submission.description || ''}
                    onChange={description => {
                        editSubmission('description', description);
                    }}
                    required={true}
                    validate={value =>
                        Validators.stringMinMax(
                            value,
                            1,
                            1000,
                            'Project description must be at least 1 character',
                            'Project description cannot be over 1000 characters'
                        )
                    }
                />
                <TextField
                    ref={ref => (this.submissionSource = ref)}
                    label="Source"
                    placeholder="A link to your source code on GitHub, BitBucket, etc."
                    value={submission.source || ''}
                    onChange={source => {
                        editSubmission('source', source);
                    }}
                    required={false}
                    validate={value =>
                        Validators.stringMinMax(
                            value,
                            1,
                            500,
                            'The link must be at least 1 character',
                            'The link cannot be over 500 characters'
                        )
                    }
                />
                <DropDown
                    ref={ref => (this.submissionLocation = ref)}
                    label="Table Location"
                    placeholder="Select a table location"
                    hint="Select the nearest table location to where you are sitting"
                    value={submission.location || ''}
                    onChange={location => {
                        editSubmission('location', location);
                    }}
                    required={true}
                    isMulti={false}
                    options={this.tableOptions()}
                    validate={Validators.noValidate}
                />
                {event.hasTracks ? (
                    <DropDown
                        ref={ref => (this.submissionTrack = ref)}
                        label="Track"
                        placeholder="Choose your track"
                        hint="Which track are you participating on?"
                        value={submission.track || ''}
                        onChange={track => {
                            editSubmission('track', track);
                        }}
                        required={true}
                        isMulti={false}
                        options={event.tracks}
                        validate={Validators.noValidate}
                    />
                ) : null}
                {event.hasChallenges ? (
                    <DropDown
                        ref={ref => (this.submissionChallenges = ref)}
                        label="Challenges"
                        placeholder="Choose your challenges"
                        hint="Which challenges did you do? Choose up to 5."
                        value={submission.challenges || []}
                        onChange={challenges => {
                            editSubmission('challenges', challenges);
                        }}
                        required={true}
                        isMulti={true}
                        options={event.challenges}
                        validate={Validators.noValidate}
                    />
                ) : null}
                <TextField
                    ref={ref => (this.submissionPhone = ref)}
                    label="Contact phone"
                    placeholder="International format (e.g. +358 0123456)"
                    value={submission.contactPhone || ''}
                    onChange={contactPhone => {
                        editSubmission('contactPhone', contactPhone);
                    }}
                    required={true}
                    validate={Validators.phoneNumber}
                />
                <SubmitButton
                    text="Update submission"
                    align="right"
                    onClick={this.saveSubmission}
                    loading={this.props.submissionLoading}
                /> */}
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
    editSubmission: (field, value) => dispatch(UserActions.editSubmission(field, value)),
    saveSubmission: (submission, secret) => dispatch(UserActions.saveSubmission(submission, secret, 1000))
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(SubmissionForm);
