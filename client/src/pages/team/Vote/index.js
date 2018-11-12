import React, { Component } from 'react';
import { connect } from 'react-redux';
import './style.scss';

import API from '../../../services/api';
import Utils from '../../../services/utils';
import * as UserSelectors from '../../../redux/user/selectors';
import * as UserActions from '../../../redux/user/actions';

import VoteWelcome from './Welcome';
import VoteError from './Error';
import VoteLoading from './Loading';
import VoteWait from './Wait';
import ProjectBlock from './ProjectBlock';
import { awaitExpression } from 'babel-types';

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
    }

    componentDidMount() {
        const { updateUser, updateEvent, user } = this.props;

        updateEvent(user.secret);
        updateUser(user.secret).then(() => {
            this.getNextDecision();
        });
    }

    getNextDecision() {
        const { user } = this.props;

        this.setState(
            {
                loading: true,
                error: false
            },
            () => {
                API.getNextDecision(user.secret)
                    .then(data => {
                        console.log('DATA', data);
                        if (data.viewed_all) {
                            this.setState({
                                current: null,
                                previous: null,
                                viewed_all: data.viewed_all,
                                loading: false,
                                error: false
                            });
                        } else if (!data.previous) {
                            this.setState({
                                current: data.current,
                                previous: null,
                                viewed_all: data.viewed_all,
                                loading: false,
                                error: false
                            });
                        } else {
                            this.animateState(data);
                        }
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

    submitVote(choice) {
        const { submitVote, user } = this.props;

        this.setState(
            {
                loading: true
            },
            () => {
                submitVote(user.secret, choice)
                    .then(() => {
                        this.getNextDecision();
                    })
                    .catch(error => {
                        this.setState({
                            error: true,
                            loading: false
                        });
                    });
            }
        );
    }

    setStateAsync(updates) {
        this.setState(updates, () => {
            return Promise.resolve();
        });
    }

    async animateState(data) {
        await this.setStateAsync({ animationPhase: 'hide-previous' });
        await Utils.sleep(500);
        await this.setStateAsync({ animationPhase: 'current-to-previous' });
        await Utils.sleep(500);
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

    renderTimeBanner() {
        const { event } = this.props;

        //TODO: show time left for voting
        return null;
    }

    renderTop() {
        const { user } = this.props;

        if (user.next && user.prev) {
            return (
                <div className="Vote--Top">
                    <h4 className="Vote--Top_title">Which project is better?</h4>
                    <p className="Vote--Top_text">
                        Go to the next project and watch their demo. After you've done that, choose if it was better or
                        worse than the project you saw immediately before it.
                    </p>
                </div>
            );
        }

        if (user.next) {
            return (
                <div className="Vote--Top">
                    <h4 className="Vote--Top_title">Go see your first project</h4>
                    <p className="Vote--Top_text">
                        After you've watched their demo, press <strong>DONE</strong>
                    </p>
                </div>
            );
        }

        return null;
    }

    renderBottom() {
        const { user } = this.props;
        const { previous, current, loading } = this.state;

        console.log('STATE', this.state);
        if (loading) {
            return (
                <div className="Vote--Bottom">
                    <i className="Vote--spinner fas fa-2x fa-spinner fa-spin" />
                </div>
            );
        }

        if (previous && current) {
            return (
                <div className="Vote--Bottom">
                    <p className="Vote--Bottom_title">Which project was better?</p>
                    <div className="Vote--Bottom_buttons">
                        <div className="Vote--Bottom_button previous" onClick={() => this.submitVote('previous')}>
                            <p className="Vote--Bottom_button-text">Previous</p>
                        </div>
                        <div className="Vote--Bottom_separator" />
                        <div className="Vote--Bottom_button" onClick={() => this.submitVote('current')}>
                            <p className="Vote--Bottom_button-text">Current</p>
                        </div>
                    </div>
                    <div className="Vote--Bottom_button skip" onClick={() => this.submitVote('skip')}>
                        <p className="Vote--Bottom_button-text">I can't find this project</p>
                    </div>
                </div>
            );
        }

        if (current) {
            return (
                <div className="Vote--Bottom">
                    <p className="Vote--Bottom_title">After you've seen the demo, click DONE.</p>
                    <div className="Vote--Bottom_buttons">
                        <div className="Vote--Bottom_button" onClick={() => this.submitVote('done')}>
                            <p className="Vote--Bottom_button-text">Done</p>
                        </div>
                    </div>
                </div>
            );
        }

        return null;
    }

    renderMid() {
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

    render() {
        const { user, userLoading, event, initAnnotator } = this.props;
        const { error } = this.state;

        if (error) {
            return (
                <div className="Vote--Wrapper">
                    <h4>Oops, something went wrong...</h4>
                    <p>Please reload the page to try again.</p>
                </div>
            );
        }

        if (!user.read_welcome) {
            return (
                <div className="Vote--Wrapper">
                    <div className="Vote--Content">
                        <h4>Welcome to voting for {event.name}</h4>
                        <p>Please read these quick instructions before you begin</p>
                    </div>
                    {this.renderBottom()}
                </div>
            );
        }

        if (!user.next) {
            return (
                <div className="Vote--Wrapper">
                    <div className="Vote--Content">
                        <h4>All projects are currently busy</h4>
                        <p>Please reload the page to check again.</p>
                    </div>
                </div>
            );
        }

        return (
            <div className="Vote--Wrapper">
                {this.renderTop()}
                {this.renderMid()}
                {this.renderBottom()}
            </div>
        );
    }
}

const mapStateToProps = state => ({
    user: UserSelectors.getUser(state),
    userLoading: UserSelectors.isLoading(state),
    userError: UserSelectors.isError(state),
    event: UserSelectors.getEvent(state),
    eventLoading: UserSelectors.isEventLoading(state),
    eventError: UserSelectors.isEventError(state)
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
