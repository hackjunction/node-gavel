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

    render() {
        if (this.props.isAuthenticated) {
            return <DefaultLayout isAdmin={true} {...this.props} />;
        }
        return <Redirect to={{ pathname: '/login', state: { onSuccess: this.props.path } }} />;
    }
}

const mapStateToProps = state => ({
    isAuthenticated: admin.isLoggedIn(state)
});

export default connect(mapStateToProps)(AdminRoute);
