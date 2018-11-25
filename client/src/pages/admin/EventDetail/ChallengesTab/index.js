import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import _ from 'lodash';
import { CSVLink } from "react-csv";
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
            challenges: [],
            winners: [],
            exportData: null,
        };

        this.exportData = this.exportData.bind(this);
    }

    componentDidMount() {
        const { adminToken, event } = this.props;

        API.adminGetChallengesForEvent(adminToken, event._id).then(challenges => {
            this.setState({ challenges });
        });

        API.adminGetChallengeWinnersForEvent(adminToken, event._id).then(winners => {
            this.setState({ winners });
        })
    }

    exportData() {
        const state = this.reactTable.getResolvedState();

        console.log('DATA', state);

        const exportData = _.map(state.resolvedData, row => {
            const o = _.pick(row, ['challenge', 'partner', 'projects', 'first', 'second', 'third', 'comments']);

            //TODO: don't hardcode this lol xd
            o.link = 'https://projects.hackjunction.com/' + row.link;
            return o;
        })


        this.setState({
            exportData
        });
    }

    getLink(secret) {
        return `/events/${this.props.event._id.toString()}/c/${secret}`;
    }

    getByChallenge(challenges, projects) {
        const byChallenge = {};

        _.each(challenges, challenge => {
            byChallenge[challenge._id] = [];
        });

        _.each(projects, project => {
            _.each(project.challenges, challenge => {
                byChallenge[challenge].push(project);
            });
        });

        let result = [];

        _.forOwn(byChallenge, (projects, challenge) => {
            const data = _.find(this.state.challenges, c => {
                return c.challenge._id === challenge;
            });
            const winnerData = _.find(this.state.winners, w => {
                return w.challenge === challenge;
            });

            const first = winnerData ? _.find(projects, p => p._id === winnerData.first) : null;
            const second = winnerData ? _.find(projects, p => p._id === winnerData.second) : null;
            const third = winnerData ? _.find(projects, p => p._id === winnerData.third) : null;
            result.push({
                challenge: data ? data.challenge.name : '',
                partner: data ? data.challenge.partner : '',
                projects,
                link: data ? this.getLink(data.secret) : null,
                first: first ? first.name : 'None',
                second: second ? second.name : 'None',
                third: third ? third.name : 'None',
                comments: winnerData ? winnerData.comments : '',
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
                        {this.state.exportData ? (
                            <CSVLink data={this.state.exportData}>
                                Download .csv
                            </CSVLink>
                        ) : (
                                <div className="EventDetail--TabAction" onClick={this.exportData}>
                                    <i className="EventDetail--TabAction_icon fas fa-file-export" />
                                    <span className="EventDetail--TabAction_name">Generate .csv</span>
                                </div>
                            )}
                    </div>
                    <i className="EventDetail--TabHeader_spinner fas fa-spinner fa-spin" />
                </div>
                <ReactTable
                    ref={ref => this.reactTable = ref}
                    data={this.getByChallenge(event.challenges, projects)}
                    columns={[
                        {
                            Header: 'Challenge',
                            accessor: 'challenge'
                        },
                        {
                            Header: 'Partner',
                            accessor: 'partner'
                        },
                        {
                            Header: 'Projects',
                            id: 'projects',
                            accessor: d => d.projects.length,
                            className: 'center'
                        },
                        {
                            Header: '1st',
                            id: 'first',
                            accessor: d => d.first || 'None',
                            className: 'center',
                        },
                        {
                            Header: '2nd',
                            accessor: 'second',
                            className: 'center',
                        },
                        {
                            Header: '3rd',
                            accessor: 'third',
                            className: 'center',
                        },
                        {
                            Header: 'Comments',
                            accessor: 'comments',
                            className: 'center',
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
                    pageSize={event.challenges.length}
                    showPageJump={false}
                    showPagination={false}
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
