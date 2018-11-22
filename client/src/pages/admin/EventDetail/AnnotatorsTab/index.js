import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment-timezone';
import FuzzySearch from 'fuzzy-search';
import Switch from 'react-switch';
import { connect } from 'react-redux';
import _ from 'lodash';

import ReactTable from 'react-table';
import 'react-table/react-table.css';
import './style.scss';

import * as AdminActions from '../../../../redux/admin/actions';
import * as AdminSelectors from '../../../../redux/admin/selectors';

class AnnotatorsTab extends Component {
    static propTypes = {
        annotators: PropTypes.array,
        loading: PropTypes.bool,
        error: PropTypes.bool,
        onRefresh: PropTypes.func,
        onToggleActive: PropTypes.func
    };

    constructor(props) {
        super(props);

        this.state = {
            filter: ''
        };
    }

    filter(annotators) {
        if (!this.state.filter) {
            return annotators;
        }

        const searcher = new FuzzySearch(annotators, ['name', 'email'], {
            caseSensitive: false
        });

        return searcher.search(this.state.filter);
    }

    onToggleActive(annotator) {
        const { adminToken, enableAnnotator, disableAnnotator, eventId } = this.props;
        if (annotator.active) {
            disableAnnotator(adminToken, annotator, eventId);
        } else {
            enableAnnotator(adminToken, annotator, eventId);
        }
    }

    getTrackName(trackId) {
        const { event } = this.props;

        const track = _.find(event.tracks, (t) => {
            return t._id === trackId;
        });

        return track ? track.name : 'None'
    }

    render() {
        return (
            <React.Fragment>
                <div className={`EventDetail--TabHeader ${this.props.loading ? ' loading' : ' '}`}>
                    <input
                        className="EventDetail--input"
                        type="text"
                        placeholder="Search all annotators"
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
                <ReactTable
                    data={this.filter(this.props.annotators)}
                    columns={[
                        {
                            Header: 'Name',
                            accessor: 'name'
                        },
                        {
                            Header: 'Email',
                            accessor: 'email'
                        },
                        {
                            Header: 'Track',
                            id: 'track',
                            accessor: d => this.getTrackName(d.assigned_track),
                            className: 'center'
                        },
                        {
                            Header: 'Updated',
                            id: 'updated',
                            accessor: d => (d.updated ? moment(d.updated).fromNow() : 'N/A'),
                            className: 'center'
                        },
                        {
                            Header: d => <div>&Alpha;</div>,
                            id: 'alpha',
                            accessor: d => Math.round(10000 * d.alpha) / 10000,
                            className: 'center'
                        },
                        {
                            Header: d => <div>&Beta;</div>,
                            id: 'beta',
                            accessor: d => Math.round(10000 * d.beta) / 10000,
                            className: 'center'
                        },
                        {
                            Header: 'Seen',
                            id: 'seen',
                            accessor: d => d.ignore.length,
                            className: 'center'
                        },
                        {
                            Header: 'Active',
                            accessor: 'active',
                            Cell: row => (
                                <Switch
                                    onChange={() => this.onToggleActive(row.original)}
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
                        }
                    ]}
                    defaultPageSize={100}
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

const mapDispatchToProps = dispatch => ({
    enableAnnotator: (token, annotatorId, eventId) =>
        dispatch(AdminActions.enableAnnotator(token, annotatorId, eventId)),
    disableAnnotator: (token, annotatorId, eventId) =>
        dispatch(AdminActions.disableAnnotator(token, annotatorId, eventId))
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(AnnotatorsTab);
