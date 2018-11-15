import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import './style.scss';

import * as AdminActions from '../../redux/admin/actions';
import * as admin from '../../redux/admin/selectors';

class AdminEventDetail extends Component {
    static propTypes = {
        annotators: PropTypes.array,
        adminToken: PropTypes.string
    };

    componentDidMount() {
        const { adminToken, match, updateAnnotators, updateEvent, updateProjects } = this.props;
        const eventId = match.params.id;

        updateAnnotators(adminToken, eventId);
        updateProjects(adminToken, eventId);
        updateEvent(adminToken, eventId);
    }

    getAnnotators() {
        const eventId = this.props.match.params.id;
        if (this.props.annotators.hasOwnProperty(eventId)) {
            return this.props.annotators[eventId];
        } else {
            return {
                data: [],
                loading: false,
                error: false
            };
        }
    }

    renderResults() {
        return null;
    }

    renderAnnotators() {
        return null;
    }

    render() {
        const annotators = this.getAnnotators();

        return (
            <div>
                <h1>Admin Panel</h1>

                <h4>Results</h4>
                {this.renderResults()}

                <h4>Annotators</h4>
                {this.renderAnnotators()}
            </div>
        );
    }
}

const mapStateToProps = state => ({
    adminToken: admin.getToken(state),
    annotators: admin.getAnnotators(state)
});

const mapDispatchToProps = dispatch => ({
    updateAnnotators: (token, eventId) => dispatch(AdminActions.fetchAnnotatorsForEvent(token, eventId)),
    updateProjects: (token, eventId) => dispatch(AdminActions.fetchProjectsForEvent(token, eventId)),
    updateEvent: (token, eventId) => dispatch(AdminActions.fetchEvent(token, eventId))
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(AdminEventDetail);
