import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import moment from 'moment-timezone';
import './style.scss';

import * as AdminActions from '../../../redux/admin/actions';
import * as admin from '../../../redux/admin/selectors';
import Table from '../../../components/Table';

class AdminEventList extends Component {
    componentWillMount() {
        this.props.fetchEvents(this.props.adminToken);
    }

    render() {
        console.log(this.props.events);
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
                            key: 'secret',
                            title: 'Secret',
                            render: item => <span>{item.apiKey}</span>
                        },
                        {
                            key: 'date',
                            title: 'Date',
                            render: item => <span>{moment(item.startTime).format('MMMM Do YYYY')}</span>
                        }
                    ]}
                    items={this.props.events}
                />
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
