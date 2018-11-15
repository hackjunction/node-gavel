import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

import ReactTable from 'react-table';
import 'react-table/react-table.css';
import './style.scss';

class ProjectsTab extends Component {
    static propTypes = {
        projects: PropTypes.array,
        loading: PropTypes.bool,
        error: PropTypes.bool
    };

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
                <div className="ProjectsTab--Track" key={track.trackName}>
                    <div className="ProjectsTab--Track_header">
                        <h4 className="ProjectsTab--Track_header-title">{track.trackName}</h4>
                        <p className="ProjectsTab--Track_header-subtitle">{track.projects.length} projects</p>
                    </div>
                    <ReactTable
                        data={track.projects}
                        columns={[
                            {
                                Header: 'Name',
                                accessor: 'name'
                            },
                            {
                                Header: 'Location',
                                accessor: 'location'
                            },
                            {
                                Header: 'Mu',
                                accessor: 'mu'
                            },
                            {
                                Header: 'Sigma',
                                accessor: 'sigma_sq'
                            }
                        ]}
                        defaultPageSize={10}
                        showPageJump={false}
                        className="-striped -highlight"
                    />
                </div>
            );
        });
    }

    render() {
        return <React.Fragment>{this.renderTables()}</React.Fragment>;
    }
}

export default ProjectsTab;
