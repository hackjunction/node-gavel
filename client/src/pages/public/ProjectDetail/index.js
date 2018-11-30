import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import moment from 'moment-timezone';
import _ from 'lodash';
import { Redirect } from 'react-router-dom';
import './style.scss';
import Utils from '../../../services/utils';

import NotFound from '../../../pages/NotFound';

import FullProject from '../../../components/ProjectBlocks/FullProject';
import BackLink from '../../../components/BackLink';

import * as CommonActions from '../../../redux/common/actions';
import * as CommonSelectors from '../../../redux/common/selectors'

class ProjectDetail extends Component {

    static propTypes = {

    }

    constructor(props) {
        super(props);

        this.state = {
            loading: true,
            error: false,
            project: null,
            event: null,
        }
    }



    componentDidMount() {
        const { updateEvents, updateProjects } = this.props;
        const { slug, projectId } = this.props.match.params;

        updateEvents().then(events => {
            const event = _.find(events, (event) => {
                return Utils.slugify(event.name) === slug;
            });

            this.setState({
                event,
            });

            if (event) {
                updateProjects(event._id).then(projects => {
                    const project = _.find(projects, (p) => p._id === projectId);

                    if (!project) {
                        throw new Error('No project found with id ' + projectId);
                    } else {
                        this.setState({
                            loading: false,
                            project,
                        });
                    }
                })
            } else {
                throw new Error('No event found with slug ' + slug);
            }
        }).catch((error) => {
            this.setState({
                loading: false,
                error: true,
            });
        })
    }

    render() {

        const { slug } = this.props.match.params;
        const { loading, error, event, project } = this.state;

        if (error) {
            return <NotFound />;
        }

        return (
            <div className="ProjectDetail">
                <div className="ProjectDetail--Header">
                    <BackLink to={`/projects/${slug}`} text="All projects" hideTextMobile={false} />
                </div>
                {loading ? (
                    <div className="ProjectDetail--Loading">
                        <i className="fa fa-spinner fa-spin fa-2x"></i>
                    </div>
                ) : (
                        <FullProject
                            project={project}
                            event={event}
                        />
                    )}
            </div>
        );
    }
}

const mapStateToProps = state => ({
    events: CommonSelectors.getEvents(state),
    eventsLoading: CommonSelectors.isEventsLoading(state),
    eventsError: CommonSelectors.isEventsError(state),
});

const mapDispatchToProps = dispatch => ({
    updateEvents: () => dispatch(CommonActions.fetchEvents()),
    updateProjects: (eventId) => dispatch(CommonActions.fetchProjectsForEvent(eventId))
});

export default connect(mapStateToProps, mapDispatchToProps)(ProjectDetail);
