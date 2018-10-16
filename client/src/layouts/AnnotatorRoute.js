import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';

import DefaultLayout from './DefaultLayout';
import * as user from '../redux/user/selectors';

class AnnotatorRoute extends Component {
    static propTypes = {
        isAuthenticated: PropTypes.bool.isRequired
    };

    static defaultProps = {
        headerTitle: 'GAVEL',
        footerText: 'Copyright Junction 2018',
    };

    render() {
        if (this.props.isAuthenticated) {
            return <DefaultLayout {...this.props} />;
        }
        return <Redirect to={{ pathname: '/' }} />;
    }
}

const mapStateToProps = state => ({
    isAuthenticated: user.isLoggedIn(state)
});

export default connect(mapStateToProps)(AnnotatorRoute);
