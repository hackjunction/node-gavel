import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import './style.scss';

class Table extends Component {
    static propTypes = {
        columns: PropTypes.arrayOf(
            PropTypes.shape({
                title: PropTypes.string,
                key: PropTypes.string,
                render: PropTypes.func
            })
        ),
        items: PropTypes.array
    };

    renderHeaders() {
        return _.map(this.props.columns, col => {
            return (
                <th key={col.key}>
                    <span>{col.title}</span>
                </th>
            );
        });
    }

    renderRows() {
        return _.map(this.props.items, item => {
            return (
                <tr>
                    {_.map(this.props.columns, col => {
                        return <td key={col.key}>{col.render(item)}</td>;
                    })}
                </tr>
            );
        });
    }

    render() {
        return (
            <table className="Table">
                <thead className="Table--header">
                    <tr>{this.renderHeaders()}</tr>
                </thead>
                <tbody className="Table--body">{this.renderRows()}</tbody>
            </table>
        );
    }
}

export default Table;
