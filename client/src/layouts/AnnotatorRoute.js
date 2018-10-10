import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';

import DefaultLayout from './DefaultLayout';

import * as admin from '../redux/admin/selectors';
import * as UserActions from '../redux/user/actions';
import * as user from '../redux/user/selectors';

import RouteLoading from './RouteLoading';
import RouteError from './RouteError';

class AnnotatorRoute extends Component {
    static propTypes = {
        isAuthenticated: PropTypes.bool.isRequired
    };

    static defaultProps = {
        headerTitle: 'GAVEL',
        headerSubtitle: '',
        footerText: 'Copyright Junction 2018',
        isAdmin: false
    };

    componentWillMount() {
        if (this.props.computedMatch && this.props.computedMatch.params) {
            const { secret } = this.props.computedMatch.params;

            if (!this.props.user || (this.props.user && this.props.user.secret !== secret)) {
                this.props.updateUser(this.props.computedMatch.params.secret);
            }
        }
    }

    render() {
        if (this.props.userLoading) {
            return <DefaultLayout {...this.props} component={RouteLoading} />;
        }

        if (!this.props.user) {
            return <DefaultLayout {...this.props} component={RouteError} />;
        }

        return <DefaultLayout {...this.props} />;
    }
}

const mapDispatchToProps = dispatch => ({
    updateUser: secret => dispatch(UserActions.fetchUser(secret))
});

const mapStateToProps = state => ({
    isAuthenticated: admin.isLoggedIn(state),
    userLoading: user.isLoading(state),
    user: user.getUser(state)
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(AnnotatorRoute);
