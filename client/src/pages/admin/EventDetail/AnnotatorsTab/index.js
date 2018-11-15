import React, { Component } from 'react';
import PropTypes from 'prop-types';

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
                            accessor: 'assigned_track'
                        },
                        {
                            Header: 'Updated',
                            accessor: 'updated'
                        },
                        {
                            Header: 'Alpha',
                            accessor: 'alpha'
                        },
                        {
                            Header: 'Beta',
                            accessor: 'beta'
                        },
                        {
                            Header: 'Seen',
                            id: 'seen',
                            accessor: d => d.ignore.length
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
