import React, { Component } from 'react';
import { connect } from 'react-redux';
import './style.scss';

import API from '../../../services/api';
import Utils from '../../../services/utils';
import * as UserSelectors from '../../../redux/user/selectors';
import * as UserActions from '../../../redux/user/actions';

import ProjectBlock from './ProjectBlock';

const STATES = {
    ERROR: 'error',
    LOADING: 'loading',
    NOT_READ_WELCOME: 'not-read-welcome',
    NO_PROJECTS_AVAILABLE: 'no-projects-available',
    DISABLED: 'disabled',
    VOTING_CLOSED: 'voting-closed',
    DONE: 'done',
    VOTE_SINGLE: 'vote-single',
    VOTE_COMPARE: 'vote-compare'
};
const ANIMATION_TIME = 500;

class Vote extends Component {
    constructor(props) {
        super(props);

        this.state = {
            current: null,
            previous: null,
            viewed_all: false,
            loading: true,
            error: false
        };

        this.initAnnotator = this.initAnnotator.bind(this);
        this.getNextDecision = this.getNextDecision.bind(this);
        this.vote = this.vote.bind(this);
    }

    componentDidMount() {
        this.updateAll().then(() => {
            this.getNextDecision();
        });
    }

    updateAll() {
        const { updateUser, updateEvent, user } = this.props;
        return Promise.all([updateEvent(user.secret), updateUser(user.secret)]);
    }

    getNextDecision() {
        const { user } = this.props;

        if (!user.read_welcome || !user.active) {
            this.setState({
                loading: false
            });
            return;
        }

        this.setState(
            {
                loading: true,
                error: false
            },
            () => {
                API.getNextDecision(user.secret)
                    .then(data => {
                        this.animateState(data);
                    })
                    .catch(error => {
                        this.setState({
                            current: null,
                            previous: null,
                            viewed_all: false,
                            loading: false,
                            error: true
                        });
                    });
            }
        );
    }

    initAnnotator() {
        const { initAnnotator, user } = this.props;

        this.setState(
            {
                loading: true
            },
            () => {
                initAnnotator(user.secret)
                    .then(() => {
                        this.getNextDecision();
                    })
                    .catch(error => {
                        this.animateState({
                            error: true,
                            loading: false
                        });
                    });
            }
        );
    }

    vote(choice) {
        const { submitVote, user } = this.props;

        this.setState(
            {
                loading: true
            },
            () => {
                submitVote(user.secret, choice)
                    .then(data => {
                        this.getNextDecision();
                    })
                    .catch(error => {
                        this.animateState({
                            error: true,
                            loading: false
                        });
                    });
            }
        );
    }

    setStateAsync(updates) {
        return new Promise(
            function(resolve, reject) {
                this.setState(updates, () => resolve());
            }.bind(this)
        );
    }

    async animateState(data) {
        if (data.error) {
            await this.setStateAsync({ animationPhase: 'hide-both' });
            await Utils.sleep(ANIMATION_TIME);
            this.setState({
                ...data,
                animationPhase: ''
            });
        } else if (data.viewed_all || !data.current) {
            await this.setStateAsync({ animationPhase: 'hide-both' });
            await Utils.sleep(ANIMATION_TIME);
            this.setState({
                current: null,
                previous: null,
                viewed_all: data.viewed_all,
                loading: false,
                error: false,
                animationPhase: ''
            });
        } else if (!data.previous) {
            this.setState({
                current: data.current,
                previous: null,
                viewed_all: false,
                loading: false,
                error: false
            });
        } else {
            await this.setStateAsync({ animationPhase: 'hide-previous' });
            await Utils.sleep(ANIMATION_TIME);
            await this.setStateAsync({ animationPhase: 'current-to-previous' });
            await Utils.sleep(ANIMATION_TIME);
            await this.setStateAsync({
                previous: data.previous,
                current: data.current,
                animationPhase: 'add-new-current'
            });
            await Utils.sleep(100);
            await this.setStateAsync({
                animationPhase: '',
                loading: false
            });
        }
    }

    getComponentState() {
        const { user, isVotingOpen } = this.props;
        const { error, loading, current, previous, viewed_all } = this.state;

        if (error) {
            return STATES.ERROR;
        }

        if (loading) {
            return STATES.LOADING;
        }

        if (viewed_all) {
            return STATES.DONE;
        }

        if (!user.active) {
            return STATES.DISABLED;
        }

        if (!user.read_welcome) {
            return STATES.NOT_READ_WELCOME;
        }

        if (!isVotingOpen()) {
            return STATES.VOTING_CLOSED;
        }

        if (current) {
            if (previous) {
                return STATES.VOTE_COMPARE;
            } else {
                return STATES.VOTE_SINGLE;
            }
        } else {
            return STATES.NO_PROJECTS_AVAILABLE;
        }
    }

    renderTop(componentState) {
        const { event } = this.props;

        switch (componentState) {
            case STATES.ERROR: {
                return (
                    <div className="Vote--Top">
                        <h4 className="Vote--Top_title">Oops, something went wrong...</h4>
                    </div>
                );
            }
            case STATES.LOADING: {
                return <div className="Vote--Top loading" />;
            }
            case STATES.NOT_READ_WELCOME: {
                return (
                    <div className="Vote--Top">
                        <h4 className="Vote--Top_title">Welcome to voting for {event.name}</h4>
                    </div>
                );
            }
            case STATES.NO_PROJECTS_AVAILABLE: {
                return (
                    <div className="Vote--Top">
                        <h4 className="Vote--Top_title">All projects are currently busy</h4>
                    </div>
                );
            }
            case STATES.DISABLED: {
                return (
                    <div className="Vote--Top">
                        <h4 className="Vote--Top_title">Your account has been disabled</h4>
                    </div>
                );
            }
            case STATES.VOTING_CLOSED: {
                return (
                    <div className="Vote--Top">
                        <h4 className="Vote--Top_title">Voting is currently not open</h4>
                    </div>
                );
            }
            case STATES.DONE: {
                return (
                    <div className="Vote--Top">
                        <h4 className="Vote--Top_title">Alright, you're done!</h4>
                    </div>
                );
            }
            case STATES.VOTE_SINGLE: {
                return (
                    <div className="Vote--Top">
                        <h4 className="Vote--Top_title">Go see your first project</h4>
                    </div>
                );
            }
            case STATES.VOTE_COMPARE: {
                return (
                    <div className="Vote--Top">
                        <h4 className="Vote--Top_title">Which project is better?</h4>
                    </div>
                );
            }
            default: {
                return <div className="Vote--Top" />;
            }
        }
    }

    renderBottom(componentState) {
        switch (componentState) {
            case STATES.ERROR: {
                return <div className="Vote--Bottom" />;
            }
            case STATES.LOADING: {
                return (
                    <div className="Vote--Bottom loading">
                        <i className="Vote--Spinner fas fa-2x fa-spinner fa-spin" />
                    </div>
                );
            }
            case STATES.NOT_READ_WELCOME: {
                return (
                    <div className="Vote--Bottom">
                        <div className="Vote--Bottom_buttons">
                            <div className="Vote--Bottom_button" onClick={this.initAnnotator}>
                                <p className="Vote--Bottom_button-text">I understand</p>
                            </div>
                        </div>
                    </div>
                );
            }
            case STATES.NO_PROJECTS_AVAILABLE: {
                return <div className="Vote--Bottom" />;
            }
            case STATES.VOTE_SINGLE: {
                return (
                    <div className="Vote--Bottom">
                        <p className="Vote--Bottom_title">After you've seen the demo, click DONE</p>
                        <div className="Vote--Bottom_buttons">
                            <div className="Vote--Bottom_button" onClick={() => this.vote('done')}>
                                <p className="Vote--Bottom_button-text">Done</p>
                            </div>
                        </div>
                    </div>
                );
            }
            case STATES.VOTE_COMPARE: {
                return (
                    <div className="Vote--Bottom">
                        <p className="Vote--Bottom_title">Which project was better?</p>
                        <div className="Vote--Bottom_buttons">
                            <div className="Vote--Bottom_button previous" onClick={() => this.vote('previous')}>
                                <p className="Vote--Bottom_button-text">Previous</p>
                            </div>
                            <div className="Vote--Bottom_separator" />
                            <div className="Vote--Bottom_button" onClick={() => this.vote('current')}>
                                <p className="Vote--Bottom_button-text">Current</p>
                            </div>
                        </div>
                    </div>
                );
            }
            default: {
                return <div className="Vote--Bottom" />;
            }
        }
    }

    renderMid(componentState) {
        switch (componentState) {
            case STATES.ERROR: {
                return (
                    <div className="Vote--Content">
                        <p className="Vote--Message">
                            Sorry about that - please reload the page to try again. You might need to submit your
                            previous vote again. <br /> <br /> If the problem persists, please close the browser window,
                            and open the app via your personal login link which you received by email.
                        </p>
                    </div>
                );
            }
            case STATES.NOT_READ_WELCOME: {
                return (
                    <div className="Vote--Content">
                        <p className="Vote--Message">Please read these quick instructions before you begin</p>
                    </div>
                );
            }
            case STATES.NO_PROJECTS_AVAILABLE: {
                return (
                    <div className="Vote--Content">
                        <p className="Vote--Message">
                            All of the projects assigned to you currently have someone else reviewing them. Please wait
                            a moment and reload the page to try again.
                        </p>
                    </div>
                );
            }
            case STATES.DONE: {
                return (
                    <div className="Vote--Content">
                        <p className="Vote--Message">
                            You've voted on all of the projects assigned to you. You can now return to your own table to
                            showcase your own project to others. <br /> <br />
                            Thank you for voting!
                        </p>
                    </div>
                );
            }
            case STATES.DISABLED: {
                return (
                    <div className="Vote--Content">
                        <p className="Vote--Message">
                            Your account has been (temporarily) disabled, which means you cannot submit any more votes
                            for the time being. To preserve the integrity of the voting result, our system automatically
                            flags accounts exhibiting suspicious behaviour. If you believe this has been done in error,
                            please contact the nearest member of the organising team and we should be able to reactivate
                            your account in no time.
                            <br /> <br />
                            Thank you for understanding :)
                        </p>
                    </div>
                );
            }
            case STATES.VOTING_CLOSED: {
                const { votingStartTime, getEventTime } = this.props;

                const isBeforeOpen = getEventTime().isBefore(votingStartTime);

                return (
                    <div className="Vote--Content">
                        <p className="Vote--Message">
                            {isBeforeOpen
                                ? `
                                More specifically, voting has not started yet. Voting begins ${votingStartTime.format(
                                    'dddd HH:mm A'
                                )}, check back here then!
                            `
                                : `
                                More specifically, voting has already closed. Thanks for participating!
                            `}
                        </p>
                    </div>
                );
            }
            default: {
                const { current, previous } = this.state;
                let wrapperClass = 'Vote--Content';

                if (!previous) {
                    wrapperClass += ' hide-previous';
                }

                if (this.state.animationPhase) {
                    wrapperClass += ' ' + this.state.animationPhase;
                }

                return (
                    <div className={wrapperClass}>
                        <div className="Vote--Previous">
                            {previous ? <ProjectBlock project={previous} isCurrent={false} /> : null}
                        </div>
                        <div className="Vote--Current">
                            {current ? <ProjectBlock project={current} isCurrent={true} /> : null}
                        </div>
                    </div>
                );
            }
        }
    }

    render() {
        const componentState = this.getComponentState();
        return (
            <div className="Vote--Wrapper">
                {this.renderTop(componentState)}
                {this.renderMid(componentState)}
                {this.renderBottom(componentState)}
            </div>
        );
    }
}

const mapStateToProps = state => ({
    user: UserSelectors.getUser(state),
    event: UserSelectors.getEvent(state),
    isVotingOpen: UserSelectors.isVotingOpen(state),
    getEventTime: UserSelectors.getNowInEventTime(state),
    votingStartTime: UserSelectors.getVotingStartTime(state),
    votingEndTime: UserSelectors.getVotingEndTime(state)
});

const mapDispatchToProps = dispatch => ({
    initAnnotator: secret => dispatch(UserActions.initAnnotator(secret)),
    submitVote: (secret, choice) => dispatch(UserActions.submitVote(secret, choice, 1000)),
    updateUser: secret => dispatch(UserActions.fetchUser(secret)),
    updateEvent: secret => dispatch(UserActions.fetchEvent(secret))
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Vote);
