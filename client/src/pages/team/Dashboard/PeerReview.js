import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

import SubmitButton from '../../../components/forms/SubmitButton';
import * as user from '../../../redux/user/selectors';

class PeerReview extends Component {
    static propTypes = {
        votingStartTime: PropTypes.object,
        votingEndTime: PropTypes.object,
        isVotingOpen: PropTypes.func,
        user: PropTypes.object,
        event: PropTypes.object,
        getEventTime: PropTypes.func
    };

    renderContent() {
        const { votingStartTime, votingEndTime, isVotingOpen, user, getEventTime } = this.props;

        if (isVotingOpen()) {
            if (user.read_welcome) {
                return (
                    <div>
                        <h4>Voting is open!</h4>
                        <p>
                            Click the link below to access the voting page and continue voting where you left off.
                            Voting ends at {votingEndTime.format('hh:mm A')} sharp.
                        </p>
                        <SubmitButton isLink="true" linkTo="/vote" text="Continue voting" />
                    </div>
                );
            } else {
                return (
                    <div>
                        <h4>Voting is open!</h4>
                        <p>
                            Click the button below to access the voting page. You will be shown a short tutorial on how
                            the voting system works before you begin. Voting ends at{' '}
                            <strong>{votingEndTime.format('h:mm A')}</strong> sharp.
                        </p>
                        <SubmitButton isLink="true" linkTo="/vote" text="Start voting" />
                    </div>
                );
            }
        } else {
            if (votingStartTime.isAfter(getEventTime())) {
                return (
                    <div>
                        <h4>Voting has not yet begun</h4>
                        <p>
                            The voting page will be accessible from{' '}
                            <strong>
                                {votingStartTime.format('hh:mm A')} to {votingEndTime.format('hh:mm A')}
                            </strong>{' '}
                            and you will be able to access it from this page.
                        </p>
                    </div>
                );
            } else {
                return (
                    <div>
                        <h4>Voting is closed!</h4>
                        <p>
                            The voting period is over and the voting platform is no longer accessible. Thank you for
                            participating!
                        </p>
                    </div>
                );
            }
        }
    }

    render() {
        const { event } = this.props;
        return (
            <div className="Voting-Tab">
                <h4>Peer Reviewing</h4>
                <p>
                    The winner of {event.name} will be decided via peer review. This means that you get to choose who
                    deserves to win each track, and out of the track winners who deserves the main prize. Peer reviewing
                    will take place in this platform once submissions have closed. You will be able to start voting for
                    the track winners here once the demo expo begins.
                    <br />
                    <br />
                    Once the track winners have been chosen and announced, you will see them on the{' '}
                    <strong>FINALS</strong> tab. From there, you'll be able to vote on the winner of the main prize,
                    look there for further instructions.
                </p>
                {this.renderContent()}
            </div>
        );
    }
}

const mapStateToProps = state => ({
    user: user.getUser(state),
    event: user.getEvent(state),
    getEventTime: user.getNowInEventTime(state),
    votingStartTime: user.getVotingStartTime(state),
    votingEndTime: user.getVotingEndTime(state),
    isVotingOpen: user.isVotingOpen(state)
});

const mapDispatchToProps = dispatch => ({});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(PeerReview);
