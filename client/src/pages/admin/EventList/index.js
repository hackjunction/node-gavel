import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import './style.scss';

import Table from '../../../components/Table';

const EVENTS = [
    {
        id: 1,
        name: 'JUNCTIONxBudapest',
        date: '23.10.2018'
    }
];

class AdminEventList extends Component {
    render() {
        return (
            <div className="AdminEventList">
                <div className="header">
                    <h3 className="title">Events</h3>
                    <Link className="create-button" to="/admin/edit/new">
                        Create Event
                    </Link>
                </div>
                <Table
                    columns={[
                        {
                            key: 'name',
                            title: 'Name',
                            render: item => <span>{item.name}</span>
                        },
                        {
                            key: 'date',
                            title: 'Date',
                            render: item => <span>{item.date}</span>
                        }
                    ]}
                    items={EVENTS}
                />
            </div>
        );
    }
}

export default AdminEventList;
