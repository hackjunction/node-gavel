import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import * as UserSelectors from '../../../redux/user/selectors';

class FinalistVote extends Component {
    renderContent() {
        return <p>TODO!</p>;
    }

    render() {
        return (
            <div className="FinalistVote">
                <h4>Track winners</h4>
                <p>
                    You'll see the winner of each track here once the track winners have been published, after the end
                    of the Demo Expo. Each track winner will get to pitch their project on the main stage in the closing
                    ceremony
                </p>
                <h4>Finalist voting</h4>
                <p>
                    After all of the track winners have had a chance to pitch their project on the main stage, voting
                    for the Main Prize winner will open here. Each participant will be able to give an upvote to their
                    favorite project, and the project with the most votes will be the winner of the Main Prize.
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

const mapDispatchToProps = dispatch => ({});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(FinalistVote);
