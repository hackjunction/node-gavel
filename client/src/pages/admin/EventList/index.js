import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import moment from 'moment-timezone';
import './style.scss';

import SubmitButton from '../../../components/forms/SubmitButton';

import * as AdminActions from '../../../redux/admin/actions';
import * as admin from '../../../redux/admin/selectors';
import Table from '../../../components/Table';

class AdminEventList extends Component {
    componentWillMount() {
        this.props.fetchEvents(this.props.adminToken);
    }

    render() {
        const hasEvents = this.props.events.length > 0;
        return (
            <div className="AdminEventList">
                <div className="header">
                    <h2 className="title">Events</h2>
                    {!hasEvents ? <p>No events have been created yet</p> : null}
                </div>
                {hasEvents ? (
                    <Table
                        columns={[
                            {
                                key: 'name',
                                title: 'Name',
                                render: item => <span>{item.name}</span>
                            },
                            {
                                key: 'secret',
                                title: 'API Key',
                                render: item => <span>{item.apiKey}</span>
                            },
                            {
                                key: 'date',
                                title: 'Date',
                                render: item => <span>{moment(item.startTime).format('MMMM Do YYYY')}</span>
                            },
                            {
                                key: 'options',
                                title: 'Options',
                                render: item => (
                                    <div>
                                        <a href={'/admin/event/' + item._id}>Admin</a>
                                        <a href={'/admin/edit/' + item._id}>Edit</a>
                                    </div>
                                )
                            }
                        ]}
                        items={this.props.events}
                    />
                ) : null}
                <SubmitButton isLink linkTo="/admin/edit/new" text="Create event" />
            </div>
        );
    }
}

const mapDispatchToProps = dispatch => ({
    fetchEvents: token => dispatch(AdminActions.fetchEvents(token))
});

const mapStateToProps = state => ({
    events: admin.getEvents(state),
    adminToken: admin.getToken(state)
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(AdminEventList);
