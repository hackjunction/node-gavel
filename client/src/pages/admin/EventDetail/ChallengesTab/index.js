import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import _ from 'lodash';

import ReactTable from 'react-table';
import 'react-table/react-table.css';
import './style.scss';

import API from '../../../../services/api';

import * as AdminSelectors from '../../../../redux/admin/selectors';

class ChallengesTab extends Component {
    static propTypes = {
        projects: PropTypes.array,
        event: PropTypes.object,
        onRefresh: PropTypes.func
    };

    constructor(props) {
        super(props);

        this.state = {
            challenges: []
        };
    }

    componentDidMount() {
        const { adminToken, event } = this.props;

        API.adminGetChallengesForEvent(adminToken, event._id.toString()).then(challenges => {
            this.setState({ challenges });
        });
    }

    getLink(secret) {
        return `/events/${this.props.event._id.toString()}/c/${secret}`;
    }

    getByChallenge(challenges, projects) {
        const byChallenge = {};

        _.each(challenges, challenge => {
            byChallenge[challenge] = [];
        });

        _.each(projects, project => {
            _.each(project.challenges, challenge => {
                byChallenge[challenge].push(project);
            });
        });

        let result = [];

        _.forOwn(byChallenge, (projects, challenge) => {
            const data = _.find(this.state.challenges, c => {
                return c.name === challenge;
            });
            result.push({
                challenge,
                projects,
                link: data ? this.getLink(data.secret) : null
            });
        });

        return result;
    }

    render() {
        const { projects, event } = this.props;

        return (
            <React.Fragment>
                <div className={`EventDetail--TabHeader ${this.props.loading ? ' loading' : ' '}`}>
                    <div className="EventDetail--TabActions">
                        <div className="EventDetail--TabAction" onClick={this.props.onRefresh}>
                            <i className="EventDetail--TabAction_icon fas fa-sync-alt" />
                            <span className="EventDetail--TabAction_name">Refresh</span>
                        </div>
                    </div>
                    <i className="EventDetail--TabHeader_spinner fas fa-spinner fa-spin" />
                </div>
                <ReactTable
                    data={this.getByChallenge(event.challenges, projects)}
                    columns={[
                        {
                            Header: 'Challenge',
                            accessor: 'challenge'
                        },
                        {
                            Header: 'Projects',
                            id: 'projects',
                            accessor: d => d.projects.length,
                            className: 'center'
                        },
                        {
                            Header: 'Link',
                            accessor: 'link',
                            Cell: row => {
                                if (!row.value) {
                                    return <span>Link unavailable</span>;
                                }
                                return (
                                    <a target="_blank" href={row.value}>
                                        View Projects
                                    </a>
                                );
                            },
                            className: 'center'
                        }
                    ]}
                    defaultSorted={[
                        {
                            id: 'challenge',
                            asc: true
                        }
                    ]}
                    defaultPageSize={50}
                    pageSizeOptions={[10, 50, 100, 500]}
                    showPageJump={false}
                    className="-striped -highlight"
                />
            </React.Fragment>
        );
    }
}

const mapStateToProps = state => ({
    adminToken: AdminSelectors.getToken(state)
});

const mapDispatchToProps = dispatch => ({});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ChallengesTab);
