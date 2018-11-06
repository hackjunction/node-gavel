import React, { Component } from 'react';
import { connect } from 'react-redux';
import './style.scss';
import * as UserSelectors from '../../../redux/user/selectors';
import * as UserActions from '../../../redux/user/actions';

import VoteWelcome from './Welcome';

class Vote extends Component {
    componentDidMount() {
        this.props.updateUser(this.props.user.secret);
    }

    setHasReadWelcome() {
        this.props.setHasReadWelcome();
    }

    render() {
        const { user, userLoading, userError } = this.props;

        if (!this.props.user.read_welcome) {
            return (
                <VoteWelcome
                    user={user}
                    loading={userLoading}
                    onContinue={() => this.props.initAnnotator(user.secret)}
                />
            );
        }

        if (userLoading) {
            return (
                <div className="Vote">
                    <h1 className="Vote--title">Loading...</h1>
                </div>
            );
        }

        if (userError) {
            return (
                <div className="Vote">
                    <h1 className="Vote--title">Oops, something went wrong</h1>
                </div>
            );
        }

        if (!user.next) {
            return (
                <div className="Vote">
                    <h1 className="Vote--title">No projects currently available</h1>
                </div>
            );
        }

        if (!user.prev) {
            return (
                <div className="Vote">
                    <h1 className="Vote--title">Take a look at your first project</h1>
                </div>
            );
        }

        return (
            <div className="Vote">
                <h1 className="Vote--title">Choose the better one of these projects</h1>
            </div>
        );
    }
}

const mapStateToProps = state => ({
    user: UserSelectors.getUser(state),
    userLoading: UserSelectors.isLoading(state),
    userError: UserSelectors.isError(state)
});

const mapDispatchToProps = dispatch => ({
    initAnnotator: secret => dispatch(UserActions.initAnnotator(secret)),
    updateUser: secret => dispatch(UserActions.fetchUser(secret))
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Vote);
