import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import _ from 'lodash';
import shuffleSeed from 'shuffle-seed';

import Form from '../../../components/forms/Form';
import BannerManager from '../../../components/BannerManager';

import API from '../../../services/api';
import * as UserSelectors from '../../../redux/user/selectors';
import * as UserActions from '../../../redux/user/actions';

class FinalistVote extends Component {

    constructor(props) {
        super(props);

        this.state = {
            winners: [],
            winnersLoading: false,
            voteLoading: false,
            winnerForm: {
                choice: this.props.user.winner_vote,
            }
        }

        this.submitVote = this.submitVote.bind(this);
    }

    componentDidMount() {
        const { user, event } = this.props;

        if (event.track_winners_public) {
            this.setState({
                winnersLoading: true,
            }, () => {
                API.getTrackWinners(user.secret, event._id).then(winners => {
                    this.setState({
                        winners,
                        winnersLoading: false,
                    })
                }).catch(error => {
                    this.setState({
                        winnersLoading: false
                    })
                });
            });
        }
    }

    submitVote() {
        const { user, submitVote } = this.props;
        const winnerId = this.state.winnerForm.choice;

        this.setState({
            voteLoading: true,
        }, () => {
            submitVote(winnerId, user.secret).then(() => {
                this.setState({ voteLoading: false })
                this.bannerManager.addBanner({
                    type: 'success',
                    text: 'Your vote has been updated!',
                },
                    'vote-submitted',
                    2000
                );
            }).catch(error => {
                this.setState({ voteLoading: false })
                this.bannerManager.addBanner({
                    type: 'error',
                    text: 'Oops, something went wrong... Your vote was not submitted, please try again.'
                },
                    'vote-submit-error',
                    2000
                );
            })
        });
    }

    getWinners() {
        return shuffleSeed.shuffle(this.state.winners, this.props.user._id);
    }

    generateWinnerChoices() {
        return _.map(this.getWinners(), (w) => {
            return {
                label: w.winner.name,
                value: w.winner._id
            }
        });
    }

    renderVoteForm() {
        const { event } = this.props;

        const isOpen = event.finalist_voting_open;

        return (
            <div className="FinalistVote--VoteForm">
                <h4 className="FinalistVote--VoteForm_title">
                    {isOpen ? 'Submit your vote' : 'Finalist voting is closed'}
                </h4>
                {isOpen ? (
                    <Form
                        submitText="Submit"
                        onSubmit={this.submitVote}
                        data={this.state.winnerForm}
                        onChange={(value) => this.setState({ winnerForm: value })}
                        loading={this.state.voteLoading}
                        fields={[
                            {
                                label: 'Your pick',
                                placeholder: 'Choose one',
                                hint: 'Choose your favorite project out of the finalists',
                                type: 'dropdown',
                                name: 'choice',
                                id: 'choice',
                                options: {
                                    multi: false,
                                    choices: this.generateWinnerChoices(),
                                    editable: true,
                                    required: true,
                                }
                            }
                        ]}
                    />
                ) : null}
                {isOpen ? (
                    <BannerManager ref={ref => this.bannerManager = ref} />
                ) : null}
            </div>
        );
    }

    renderTrackWinners() {
        const { event, user } = this.props;
        const { winners, winnersLoading } = this.state;

        if (!winnersLoading && winners) {
            const blocks = _.map(this.getWinners(), (item) => {
                const bg = item.image ? item.image : require('../../../assets/default_img.png');
                return (
                    <div key={item.track._id} className="TrackWinner--Block">
                        <div className="TrackWinner--Block_Track">
                            <h4 className="TrackWinner--Block_Track-name">{item.track.name}</h4>
                        </div>
                        <div className="TrackWinner--Block_image" style={{ backgroundImage: 'url(' + bg + ')' }}></div>
                        <div className="TrackWinner--Block_Project">
                            <h4 className="TrackWinner--Block_Project-name">{item.winner.name}</h4>
                            <p className="TrackWinner--Block_Project-punchline">{item.winner.punchline}</p>
                            {item.winner.demo ? <a target="_blank" className="TrackWinner--Block_Project-demo" href={item.winner.demo}>Demo</a> : null}
                            {' '}
                            {item.winner.source ? <a target="_blank" className="TrackWinner--Block_Project-demo" href={item.winner.source}>Source</a> : null}
                        </div>
                    </div>
                );
            })
            return (
                <div className="FinalistVote--TrackWinners-List">
                    {blocks}
                </div>
            );
        }
        else {
            return (
                <div className="FinalistVote--TrackWinners-Loading">
                    <i className="fa fa-spinner fa-spin"></i>
                </div>
            );
        }
    }

    renderContent() {

        const { event } = this.props;
        if (!event.track_winners_public) {
            return (
                <div className="FinalistVote--TrackWinners">
                    <h4>Track winners not yet announced</h4>
                </div>
            );
        } else {
            return (
                <div className="FinalistVote--TrackWinners">
                    {event.finalist_voting_open ? (
                        <div>
                            <h4>Finalist voting is open!</h4>
                            <p>You'll be able to submit your vote at the bottom of this list - choose carefully!</p>
                        </div>
                    ) : (
                            <div>
                                <h4>Track Winners</h4>
                                <p><strong>Track winners</strong> You'll see the winner of each track below, as decided by you and your peers.
                                Voting for the Main Prize winner will be opened here soon, after all track winners have pitched their project.
                        </p>

                            </div>
                        )}
                    {this.renderTrackWinners()}
                    {this.renderVoteForm()}
                </div>
            );
        }
    }

    render() {
        return (
            <div className="FinalistVote">
                <h4>Finals</h4>
                <p>
                    Here you will be able to see the track winners after the demo expo has ended and the track winners have been announced.
                    You, the participants, will also get to vote on the winner of the Main Prize after seeing all of the track winners' pitches.
                    Make sure to come and listen to the final pitches on the Main Stage, starting 16:00 on Sunday.
                    <br />
                    <br />
                    After all of the track winners have pitched their project, each participant will be able to give an upvote to their favorite
                    project. The project with the most votes will be the winner of the Main Prize. The voting will happen on this page, and will be
                    available once all of the track winners are done with their pitch.
                    <br />
                    <br />
                    To make the voting as fair as possible, each participant will be shown the track winners in a random order. This means that
                    they will most likely not be in the order that they pitched on stage in.
                </p>
                {this.renderContent()}
            </div>
        );
    }
}

const mapStateToProps = state => ({
    event: UserSelectors.getEvent(state),
    user: UserSelectors.getUser(state)
});

const mapDispatchToProps = dispatch => ({
    submitVote: (projectId, secret) => dispatch(UserActions.updateWinnerVote(projectId, secret))
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(FinalistVote);
