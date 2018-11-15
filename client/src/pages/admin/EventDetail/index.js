import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import './style.scss';

import OverviewTab from './OverviewTab';
import ProjectsTab from './ProjectsTab';
import AnnotatorsTab from './AnnotatorsTab';

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
            eventId: this.props.match.params.id,
            activeTab: 0
        };
    }

    componentDidMount() {
        const { adminToken, updateAnnotators, updateEvent, updateProjects } = this.props;
        const { eventId } = this.state;

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

    renderError(title, subtitle) {
        return (
            <div className="EventDetail--Error">
                <i className="EventDetail--Error_icon fas fa-2x fa-exclamation-circle" />
                <h4 className="EventDetail--Error_title">{title}</h4>
                <p className="EventDetail--Error_subtitle">{subtitle}</p>
            </div>
        );
    }

    renderLoading(title, subtitle) {
        return (
            <div className="EventDetail--Loading">
                <i className="EventDetail--Loading_spinner fas fa-spinner fa-spin" />
                <h4 className="EventDetail--Loading_title">{title}</h4>
                <p className="EventDetail--Loading_subtitle">{subtitle}</p>
            </div>
        );
    }

    renderOverview() {
        const {
            getEvent,
            getProjects,
            isProjectsLoading,
            isProjectsError,
            getAnnotators,
            isAnnotatorsLoading,
            isAnnotatorsError
        } = this.props;

        const { eventId } = this.state;

        if (isProjectsError(eventId) || isAnnotatorsError(eventId)) {
            return this.renderError('Unable to get event data', 'Please reload the page to try again');
        }

        if (isProjectsLoading(eventId) || isAnnotatorsLoading(eventId)) {
            return this.renderLoading('Loading event data', 'Hold on...');
        }

        return (
            <OverviewTab
                projects={getProjects(eventId)}
                annotators={getAnnotators(eventId)}
                event={getEvent(eventId)}
                loading={isProjectsLoading(eventId) || isAnnotatorsLoading(eventId)}
                error={isProjectsError(eventId) || isAnnotatorsError(eventId)}
            />
        );
    }

    renderResults() {
        const { getProjects, isProjectsLoading, isProjectsError } = this.props;
        const { eventId } = this.state;

        if (isProjectsError(eventId)) {
            return this.renderError('Unable to get projects', 'Please reload the page to try again');
        }

        if (isProjectsLoading(eventId)) {
            return this.renderLoading('Getting projects', 'Hold on...');
        }

        return (
            <ProjectsTab
                projects={getProjects(eventId)}
                loading={isProjectsLoading(eventId)}
                error={isProjectsError(eventId)}
            />
        );
    }

    renderAnnotators() {
        const { getAnnotators, isAnnotatorsLoading, isAnnotatorsError } = this.props;
        const { eventId } = this.state;

        if (isAnnotatorsError(eventId)) {
            return this.renderError('Unable to get annotators', 'Please reload the page to try again');
        }

        if (isAnnotatorsLoading(eventId)) {
            return this.renderLoading('Getting annotators', 'Hold on...');
        }

        return (
            <AnnotatorsTab
                annotators={getAnnotators(eventId)}
                loading={isAnnotatorsLoading(eventId)}
                error={isAnnotatorsError(eventId)}
            />
        );
    }

    renderContent() {
        switch (this.state.activeTab) {
            case 0:
                return this.renderOverview();
            case 1:
                return this.renderResults();
            case 2:
                return this.renderAnnotators();
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
                        <span className="EventDetail--Tab_text">Overview</span>
                    </div>
                    <div
                        className={this.state.activeTab === 1 ? 'EventDetail--Tab active' : 'EventDetail--Tab'}
                        onClick={() => this.setState({ activeTab: 1 })}
                    >
                        <span className="EventDetail--Tab_text">Results</span>
                    </div>
                    <div
                        className={this.state.activeTab === 2 ? 'EventDetail--Tab active' : 'EventDetail--Tab'}
                        onClick={() => this.setState({ activeTab: 2 })}
                    >
                        <span className="EventDetail--Tab_text">Annotators</span>
                    </div>
                </div>
                <div className="EventDetail--Content">{this.renderContent()}</div>
            </div>
        );
    }
}

const mapStateToProps = state => ({
    adminToken: admin.getToken(state),
    getEvent: admin.getEvent(state),
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
