import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import './style.scss';

import * as AdminActions from '../../../redux/admin/actions';
import * as admin from '../../../redux/admin/selectors';

class AdminEventDetail extends Component {
    static propTypes = {
        annotators: PropTypes.array,
        adminToken: PropTypes.string
    };

    constructor(props) {
        super(props);

        this.state = {
            eventId: this.props.match.params.eventId,
            activeTab: 0
        };
    }

    componentDidMount() {
        const { adminToken, match, updateAnnotators, updateEvent, updateProjects } = this.props;
        const eventId = match.params.id;

        updateAnnotators(adminToken, eventId);
        updateProjects(adminToken, eventId);
        updateEvent(adminToken, eventId);
    }

    getAnnotators() {
        const eventId = this.props.match.params.id;
        if (this.props.annotators.hasOwnProperty(eventId)) {
            return this.props.annotators[eventId];
        } else {
            return {
                data: [],
                loading: false,
                error: false
            };
        }
    }

    renderResults() {
        const { getProjects, isProjectsLoading, isProjectsError } = this.props;
        const { eventId } = this.state;
        console.log('PROJECTS', {
            data: getProjects(eventId),
            loading: isProjectsLoading(eventId),
            error: isProjectsError(eventId)
        });
        return (
            <React.Fragment>
                <h4>Results</h4>
            </React.Fragment>
        );
    }

    renderAnnotators() {
        const { getAnnotators, isAnnotatorsLoading, isAnnotatorsError } = this.props;
        const { eventId } = this.state;
        console.log('ANNOTATORS', {
            data: getAnnotators(eventId),
            loading: isAnnotatorsLoading(eventId),
            error: isAnnotatorsError(eventId)
        });
        return (
            <React.Fragment>
                <h4>Annotators</h4>
            </React.Fragment>
        );
    }

    renderContent() {
        switch (this.state.activeTab) {
            case 0:
                return this.renderResults();
            case 1:
                return this.renderAnnotators();
            case 2:
                return null;
            default:
                return null;
        }
    }

    render() {
        return (
            <div className="EventDetail">
                <div className="EventDetail--Tabs">
                    <div
                        className={this.state.activeTab === 0 ? 'EventDetail--Tab active' : 'EventDetail--Tab'}
                        onClick={() => this.setState({ activeTab: 0 })}
                    >
                        <span className="EventDetail--Tab_text">Results</span>
                    </div>
                    <div
                        className={this.state.activeTab === 1 ? 'EventDetail--Tab active' : 'EventDetail--Tab'}
                        onClick={() => this.setState({ activeTab: 1 })}
                    >
                        <span className="EventDetail--Tab_text">Annotators</span>
                    </div>
                    <div
                        className={this.state.activeTab === 2 ? 'EventDetail--Tab active' : 'EventDetail--Tab'}
                        onClick={() => this.setState({ activeTab: 2 })}
                    >
                        <span className="EventDetail--Tab_text">Edit</span>
                    </div>
                </div>
                <div className="EventDetail--Content">{this.renderContent()}</div>
            </div>
        );
    }
}

const mapStateToProps = state => ({
    adminToken: admin.getToken(state),
    getAnnotators: admin.getAnnotators(state),
    isAnnotatorsLoading: admin.getAnnotatorsLoading(state),
    isAnnotatorsError: admin.getAnnotatorsError(state),
    getProjects: admin.getProjects(state),
    isProjectsLoading: admin.getProjectsLoading(state),
    isProjectsError: admin.getProjectsError(state)
});

const mapDispatchToProps = dispatch => ({
    updateAnnotators: (token, eventId) => dispatch(AdminActions.fetchAnnotatorsForEvent(token, eventId)),
    updateProjects: (token, eventId) => dispatch(AdminActions.fetchProjectsForEvent(token, eventId)),
    updateEvent: (token, eventId) => dispatch(AdminActions.fetchEvent(token, eventId))
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(AdminEventDetail);
