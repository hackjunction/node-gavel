import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment-timezone';

import ReactTable from 'react-table';
import 'react-table/react-table.css';
import './style.scss';

class AnnotatorsTab extends Component {
    static propTypes = {
        annotators: PropTypes.array,
        loading: PropTypes.bool,
        error: PropTypes.bool
    };

    render() {
        return (
            <React.Fragment>
                <ReactTable
                    data={this.props.annotators}
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
                            accessor: d => d.assigned_track || 'None',
                            className: 'center'
                        },
                        {
                            Header: 'Updated',
                            id: 'updated',
                            accessor: d => (d.updated ? moment(d.updated).fromNow() : 'N/A'),
                            className: 'center'
                        },
                        {
                            Header: 'Alpha',
                            id: 'alpha',
                            accessor: d => Math.round(10000 * d.alpha) / 10000,
                            className: 'center'
                        },
                        {
                            Header: 'Beta',
                            id: 'beta',
                            accessor: d => Math.round(10000 * d.beta) / 10000,
                            className: 'center'
                        },
                        {
                            Header: 'Seen',
                            id: 'seen',
                            accessor: d => d.ignore.length,
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

export default AnnotatorsTab;
