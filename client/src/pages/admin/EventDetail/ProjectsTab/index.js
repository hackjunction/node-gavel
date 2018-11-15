import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import _ from 'lodash';

import * as AdminActions from '../../../../redux/admin/actions';
import * as AdminSelectors from '../../../../redux/admin/selectors';

import 'react-table/react-table.css';
import './style.scss';

import ProjectsTable from './ProjectsTable';

class ProjectsTab extends Component {
    static propTypes = {
        projects: PropTypes.array,
        eventId: PropTypes.string,
        loading: PropTypes.bool,
        error: PropTypes.bool
    };

    constructor(props) {
        super(props);

        this.toggleActive = this.toggleActive.bind(this);
        this.togglePrioritised = this.togglePrioritised.bind(this);
    }

    toggleActive(project) {
        const { disableProject, enableProject, adminToken, eventId } = this.props;
        if (project.active) {
            disableProject(adminToken, project, eventId);
        } else {
            enableProject(adminToken, project, eventId);
        }
    }

    togglePrioritised(project) {
        const { prioritiseProject, deprioritiseProject, adminToken, eventId } = this.props;
        if (project.prioritized) {
            deprioritiseProject(adminToken, project, eventId);
        } else {
            prioritiseProject(adminToken, project, eventId);
        }
    }

    renderTables() {
        const { projects } = this.props;
        const grouped = _.groupBy(projects, 'track');
        let tracks = [];
        _.forOwn(grouped, (projects, trackName) => {
            tracks.push({
                trackName,
                projects
            });
        });

        tracks = _.sortBy(tracks, 'trackName');

        return _.map(tracks, track => {
            return (
                <ProjectsTable
                    trackName={track.trackName}
                    projects={track.projects}
                    onToggleActive={this.toggleActive}
                    onTogglePrioritised={this.togglePrioritised}
                />
            );
        });
    }

    render() {
        return <React.Fragment>{this.renderTables()}</React.Fragment>;
    }
}

const mapStateToProps = state => ({
    adminToken: AdminSelectors.getToken(state)
});

const mapDispatchToProps = dispatch => ({
    enableProject: (token, projectId, eventId) => dispatch(AdminActions.enableProject(token, projectId, eventId)),
    disableProject: (token, projectId, eventId) => dispatch(AdminActions.disableProject(token, projectId, eventId)),
    prioritiseProject: (token, projectId, eventId) =>
        dispatch(AdminActions.prioritiseProject(token, projectId, eventId)),
    deprioritiseProject: (token, projectId, eventId) =>
        dispatch(AdminActions.deprioritiseProject(token, projectId, eventId))
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ProjectsTab);
