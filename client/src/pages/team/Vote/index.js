import React, { Component } from 'react';
import { connect } from 'react-redux';
import './style.scss';
import * as UserSelectors from '../../../redux/user/selectors';
import * as UserActions from '../../../redux/user/actions';

import VoteWelcome from './Welcome';
import VoteError from './Error';
import VoteLoading from './Loading';
import VoteWait from './Wait';

class Vote extends Component {
    constructor(props) {
        super(props);

        this.init = this.init.bind(this);
    }

    componentDidMount() {
        this.props.updateUser(this.props.user.secret);
        this.props.updateEvent(this.props.user.secret);
    }

    init() {
        const { user, initAnnotator } = this.props;
        initAnnotator(user.secret).catch(() => {
            window.alert('Error on init!');
        });
    }

    render() {
        const { user, userLoading, userError, eventLoading, eventError } = this.props;

        if (userLoading || eventLoading) {
            return <VoteLoading />;
        }

        if (userError || eventError) {
            return <VoteError />;
        }

        if (!user.read_welcome) {
            return <VoteWelcome user={user} loading={userLoading} onContinue={this.init} />;
        }

        if (!user.next) {
            return <VoteWait />;
        }

        if (!user.prev) {
            return (
                <div className="Vote">
                    <h4>Go see your first project</h4>
                    <p>
                        After you've watched their demo, press <strong>DONE</strong>
                    </p>
                    <div className="Vote--item previous">
                        <h4 className="Vote--item_name">Item 1</h4>
                        <p className="Vote--item_location">Location: A9</p>
                        <p className="Vote--item_description">asfgoasgobasgbasgbasgasgbasgbsabgasg</p>
                    </div>
                </div>
            );
        }

        return (
            <div className="Vote">
                <h4>Which project is better?</h4>
                <p>
                    Go to the next project and watch their demo. After you've done that, choose if it was better or
                    worse than the project you saw immediately before it.
                </p>
                <div className="Vote--item previous">
                    <h4 className="Vote--item_name">Item 1</h4>
                    <p className="Vote--item_location">Location: A9</p>
                    <p className="Vote--item_description">asfgoasgobasgbasgbasgasgbasgbsabgasg</p>
                </div>
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
    updateUser: secret => dispatch(UserActions.fetchUser(secret)),
    updateEvent: secret => dispatch(UserActions.fetchEvent(secret))
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Vote);
