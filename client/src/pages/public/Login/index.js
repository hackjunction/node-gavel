import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import './style.scss';

import API from '../../../services/api';

import * as UserActions from '../../../redux/user/actions';

class Login extends Component {
    static propTypes = {
        match: PropTypes.any.isRequired,
        updateUser: PropTypes.func.isRequired,
        userLoading: PropTypes.bool.isRequired,
        userError: PropTypes.bool.isRequired,
        user: PropTypes.object
    };

    constructor(props) {
        super(props);

        this.state = {
            ready: false,
            error: false,
            loading: true
        };
    }

    componentDidMount() {
        this.props.logout();
        API.getUser(this.props.match.params.secret)
            .then(user => {
                this.props.setUser(user);

                this.setState({
                    ready: true,
                    loading: false,
                    error: false
                });
            })
            .catch(err => {
                this.setState({
                    ready: false,
                    loading: false,
                    error: true
                });
            });
    }

    render() {
        const { ready, error, loading } = this.state;

        if (loading) {
            return (
                <div className="Login--wrapper">
                    <i className="fas fa-2x fa-spinner fa-spin" />
                </div>
            );
        }

        if (error) {
            return (
                <div className="Login--wrapper">
                    <h2>Invalid link</h2>
                    <p>It seems like this login link is invalid</p>
                    <p>If your team hasn't yet registered, you should do so via the registration platform.</p>
                </div>
            );
        }

        if (ready) {
            return <Redirect to="/dashboard" />;
        }

        return null;
    }
}

const mapDispatchToProps = dispatch => ({
    setUser: user => dispatch(UserActions.setUser(user)),
    logout: () => dispatch(UserActions.logout())
});

const mapStateToProps = state => ({});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Login);
