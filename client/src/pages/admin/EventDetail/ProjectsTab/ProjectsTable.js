import React, { Component } from 'react';
import PropTypes from 'prop-types';
import FuzzySearch from 'fuzzy-search';
import Switch from 'react-switch';

import ReactTable from 'react-table';
import 'react-table/react-table.css';
import './style.scss';

class ProjectsTable extends Component {
    static propTypes = {
        projects: PropTypes.array,
        trackName: PropTypes.string,
        onToggleActive: PropTypes.func,
        onTogglePrioritised: PropTypes.func
    };

    constructor(props) {
        super(props);

        this.state = {
            filter: '',
            expanded: false
        };
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

    render() {
        const { projects, trackName } = this.props;

        return (
            <div className="ProjectsTab--Track" key={trackName}>
                <div className="ProjectsTab--Track_header">
                    <div className="ProjectsTab--Track_header-left">
                        <h4 className="ProjectsTab--Track_header-title">{trackName}</h4>
                        <p className="ProjectsTab--Track_header-subtitle">{projects.length} projects</p>
                    </div>
                    <div className="ProjectsTab--Track_header-right">
                        <input
                            className="ProjectsTab--Track_header-input"
                            type="text"
                            value={this.state.filter}
                            onChange={e => this.setState({ filter: e.target.value })}
                            placeholder="Search for projects"
                        />
                    </div>
                </div>
                <ReactTable
                    data={this.filter(projects)}
                    columns={[
                        {
                            Header: 'Name',
                            accessor: 'name'
                        },
                        {
                            Header: 'Location',
                            accessor: 'location',
                            className: 'center'
                        },
                        {
                            Header: 'Mu',
                            id: 'mu',
                            accessor: d => Math.round(10000 * d.mu) / 10000,
                            className: 'center'
                        },
                        {
                            Header: 'Sigma',
                            id: 'sigma',
                            accessor: d => Math.round(10000 * d.sigma_sq) / 10000,
                            className: 'center'
                        },
                        {
                            Header: 'Views',
                            id: 'views',
                            accessor: d => (d.viewed_by ? d.viewed_by.length : 0),
                            className: 'center'
                        },
                        {
                            Header: 'Skips',
                            id: 'skips',
                            accessor: d => (d.skipped_by ? d.skipped_by.length : 0),
                            className: 'center'
                        },
                        {
                            Header: 'Active',
                            accessor: 'active',
                            Cell: row => (
                                <Switch
                                    onChange={() => this.props.onToggleActive(row.original)}
                                    checked={row.original.active}
                                    checkedIcon={false}
                                    uncheckedIcon={false}
                                    height={20}
                                    width={40}
                                    onColor={'#00ff99'}
                                    offColor={'#cc0000'}
                                />
                            ),
                            className: 'center'
                        },
                        {
                            Header: 'Prioritized',
                            accessor: 'prioritized',
                            Cell: row => (
                                <Switch
                                    onChange={() => this.props.onTogglePrioritised(row.original)}
                                    checked={row.original.prioritized}
                                    checkedIcon={false}
                                    uncheckedIcon={false}
                                    height={20}
                                    width={40}
                                    onColor={'#35e2df'}
                                />
                            ),
                            className: 'center'
                        }
                    ]}
                    defaultPageSize={10}
                    showPageJump={false}
                    className="-striped -highlight"
                />
            </div>
        );
    }
}

export default ProjectsTable;
