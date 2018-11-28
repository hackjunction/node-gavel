import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import _ from 'lodash';
import FuzzySearch from 'fuzzy-search';

import * as AdminActions from '../../../../redux/admin/actions';
import * as AdminSelectors from '../../../../redux/admin/selectors';

import 'react-table/react-table.css';
import './style.scss';

import ProjectsTable from './ProjectsTable';
import ProjectOverlay from '../ProjectOverlay';

class ProjectsTab extends Component {
    static propTypes = {
        projects: PropTypes.array,
        eventId: PropTypes.string,
        event: PropTypes.object,
        loading: PropTypes.bool,
        error: PropTypes.bool
    };

    constructor(props) {
        super(props);

        this.state = {
            filter: '',
            activeProject: null,
        };

        this.toggleActive = this.toggleActive.bind(this);
        this.togglePrioritised = this.togglePrioritised.bind(this);
        this.onSelect = this.onSelect.bind(this);
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

    onSelect(project) {
        this.setState({
            activeProject: project
        });
    }

    filter(projects) {
        if (!this.state.filter) {
            return projects;
        }

        const searcher = new FuzzySearch(projects, ['name'], {
            caseSensitive: false
        });

        return searcher.search(this.state.filter);
    }

    renderTables() {
        const { event } = this.props;
        const projects = this.filter(this.props.projects);
        const grouped = {};

        _.each(event.tracks, track => (grouped[track._id] = []));

        _.each(projects, project => {
            grouped[project.track].push(project);
        });

        let tracks = [];
        _.forOwn(grouped, (projects, track) => {
            tracks.push({
                trackName: _.find(event.tracks, (t) => t._id === track).name,
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
                    onSelect={this.onSelect}
                    hideFilter={this.state.filter.length > 0}
                />
            );
        });
    }

    renderActive() {
        return (
            <ProjectOverlay
                project={this.state.activeProject}
                event={this.props.event}
                annotators={this.props.annotators}
                onClose={() => this.setState({ activeProject: null })}
            />
        );
    }

    render() {
        return (
            <React.Fragment>
                {this.state.activeProject ? this.renderActive() : null}
                <div className={`EventDetail--TabHeader ${this.props.loading ? ' loading' : ' '}`}>
                    <input
                        className="EventDetail--input"
                        type="text"
                        placeholder="Search all projects"
                        onChange={e => this.setState({ filter: e.target.value })}
                    />
                    <div className="EventDetail--TabActions">
                        <div className="EventDetail--TabAction" onClick={this.props.onRefresh}>
                            <i className="EventDetail--TabAction_icon fas fa-sync-alt" />
                            <span className="EventDetail--TabAction_name">Refresh</span>
                        </div>
                    </div>
                    <i className="EventDetail--TabHeader_spinner fas fa-spinner fa-spin" />
                </div>
                {this.renderTables()}
            </React.Fragment>
        );
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
