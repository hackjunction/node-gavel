import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';

import DefaultLayout from './DefaultLayout';
import * as admin from '../redux/admin/selectors';

class AdminRoute extends Component {
    static propTypes = {
        isAuthenticated: PropTypes.bool.isRequired
    };

    static defaultProps = {
        headerTitle: 'GAVEL',
        headerSubtitle: 'GOD MODE',
        footerText: 'Copyright Junction 2018',
        isAdmin: true
    };

    render() {
        if (this.props.isAuthenticated) {
            return <DefaultLayout {...this.props} />;
        }
        return <Redirect to={{ pathname: '/admin/login', state: { onSuccess: '/admin' } }} />;
    }
}

const mapStateToProps = state => ({
    isAuthenticated: admin.isLoggedIn(state)
});

export default connect(mapStateToProps)(AdminRoute);
