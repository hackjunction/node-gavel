import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import ProjectList from '../../components/ProjectList';
import AnnotatorList from '../../components/AnnotatorList';
import './style.scss';

import * as AdminActions from '../../redux/admin/actions';
import * as admin from '../../redux/admin/selectors';

class AdminPanel extends Component {
    static propTypes = {
        annotators: PropTypes.array,
        adminToken: PropTypes.string
    };

    constructor(props) {
        super(props);

        this.state = {
            projects: []
        };
    }

    componentDidMount() {
        const adminToken = this.props.adminToken;
        const eventId = this.props.match.params.id;

        this.props.updateAnnotators(adminToken, eventId);
    }

    getAnnotators() {
        const { eventId } = this.props.match.params.id;
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

    render() {
        const eventId = this.props.match.params.id;
        const annotators = this.getAnnotators();

        console.log('ANNOTATORS', annotators);

        //annotators.data
        //annotators.loading
        //annotators.error

        return (
            <div>
                <h1>Admin Panel</h1>
                <ProjectList />
                <AnnotatorList />
            </div>
        );
    }
}

const mapStateToProps = state => ({
    adminToken: state => admin.getToken(state),
    annotators: state => admin.getAnnotators(state)
});

const mapDispatchToProps = dispatch => ({
    updateAnnotators: (token, eventId) => dispatch(AdminActions.fetchAnnotatorsForEvent(token, eventId))
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(AdminPanel);
