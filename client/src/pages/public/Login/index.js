import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import './style.scss';

import * as UserActions from '../../../redux/user/actions';
import * as user from '../../../redux/user/selectors';

class Login extends Component {
    static propTypes = {
        match: PropTypes.any.isRequired,
        updateUser: PropTypes.func.isRequired,
        userLoading: PropTypes.bool.isRequired,
        userError: PropTypes.bool.isRequired,
        user: PropTypes.object
    };

    componentDidMount() {
        this.props.updateUser(this.props.match.params.secret);
    }

    render() {
        if (this.props.user && !this.props.userLoading && !this.props.userError) {
            return <Redirect to="/dashboard" />;
        }

        if (this.props.userError) {
            return (
                <div className="Login--wrapper">
                    <h2>Invalid link</h2>
                    <p>It seems like this login link is invalid</p>
                    <p>
                        If your team hasn't yet registered, you can create a team <a href="/teams/create">here</a>.
                    </p>
                </div>
            );
        }

        return (
            <div className="Login--wrapper">
                <i className="fas fa-2x fa-spinner fa-spin" />
            </div>
        );
    }
}

const mapDispatchToProps = dispatch => ({
    updateUser: secret => dispatch(UserActions.fetchUser(secret)),
    logout: () => dispatch(UserActions.logout())
});

const mapStateToProps = state => ({
    userLoading: user.isLoading(state),
    userError: user.isError(state),
    user: user.getUser(state)
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Login);
