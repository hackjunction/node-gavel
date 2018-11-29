import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import moment from 'moment-timezone';
import _ from 'lodash';
import { Redirect } from 'react-router-dom';
import { Image, Transformation } from 'cloudinary-react';
import './style.scss';
import Utils from '../../../services/utils';
import Filters from './Filters';

import * as CommonSelectors from '../../../redux/common/selectors';
import * as CommonActions from '../../../redux/common/actions';

class Projects extends Component {

    static propTypes = {
        events: PropTypes.array,
        eventsLoading: PropTypes.bool,
        eventsError: PropTypes.bool,
    }

    constructor(props) {
        super(props);

        this.state = {
            event: null,
            project: null,
            loading: true,
            error: false,
        }
    }

    componentDidMount() {
        const { updateEvents } = this.props;
        const { slug, projectId } = this.props.match.params;



        updateEvents().then(events => {
            const event = _.find(events, (event) => {
                return Utils.slugify(event.name) === slug;
            });

            if (event) {
                //TODO: Get project
                this.setState({
                    loading: false,
                    error: false,
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

    getTrackName(trackId) {
        const track = _.find(this.state.event.tracks, (t) => t._id === trackId);

        return track ? track.name : '';
    }

    renderImage(url) {
        if (!url) {
            return (
                <div className="ProjectsGallery--Block_img-wrapper">
                    <img src={require('../../../assets/default_img_small.png')} className="ProjectsGallery--Block_img" />
                </div>
            );
        } else {
            const parts = url.split('/');
            parts[6] += ',q_auto/w_480';


            return (
                <div className="ProjectsGallery--Block_img-wrapper">
                    <img src={parts.join('/')} className="ProjectsGallery--Block_img" />
                </div>
            );
        }
    }

    renderAwards(project) {
        switch (project.trackPos) {
            case 1: return (
                <div className="ProjectsGallery--Block_awards">
                    <i className="ProjectsGallery--Block_icon-gold fas fa-award"></i>
                    <span className="ProjectsGallery--Block_rank">1st: {this.getTrackName(project.track)}</span>
                </div>
            );
            case 2: return (
                <div className="ProjectsGallery--Block_awards">
                    <i className="ProjectsGallery--Block_icon-silver fas fa-award"></i>
                    <span className="ProjectsGallery--Block_rank">2nd: {this.getTrackName(project.track)}</span>
                </div>
            );
            case 3: return (
                <div className="ProjectsGallery--Block_awards">
                    <i className="ProjectsGallery--Block_icon-bronze fas fa-award"></i>
                    <span className="ProjectsGallery--Block_rank">3rd: {this.getTrackName(project.track)}</span>
                </div>
            );
            default: return null;
        }
    }

    render() {
        const { eventsLoading, eventsError, isProjectsLoading, isProjectsError, getProjects } = this.props;
        const { ready, event } = this.state;

        if (eventsLoading || !ready || (event && isProjectsLoading(event._id))) {
            return (
                <div className="Projects">
                    <div className="Projects_loading">
                        <i className="fa fa-spinner fa-spin"></i>
                    </div>
                </div>
            );
        }

        if (!event || isProjectsError(event._id)) {
            return <Redirect to="/404"></Redirect>
        }

        const projects = this.getFilteredProjects();

        return (
            <div className="Projects">
                <div className="Projects_header">
                    <h1 className="Projects_header-title">{event.name}</h1>
                    <div className="Projects_header-separator" />
                    <p className="Projects_header">{moment(event.startTime).format('DD.MM.YYYY')} - {moment(event.endTime).format('DD.MM.YYYY')}</p>
                </div>
                <div className="Projects_filters">
                    <Filters
                        label="Track"
                        items={_.map(this.state.event.tracks, (track) => {
                            return {
                                label: track.name,
                                value: track._id
                            }
                        })}
                        selected={this.state.selectedTrack}
                        onChange={(value) => this.setState({ selectedTrack: value, selectedChallenge: null })}
                    />
                    <Filters
                        label="Challenge"
                        items={_.map(this.state.event.challenges, (challenge) => {
                            return {
                                label: challenge.name,
                                value: challenge._id
                            }
                        })}
                        selected={this.state.selectedChallenge}
                        onChange={(value) => this.setState({ selectedChallenge: value, selectedTrack: null })}
                    />
                </div>
                <div className="ProjectsGallery--Header">
                    <p>Showing {projects.length} projects</p>
                </div>
                <div className="ProjectsGallery">
                    {this.renderProjects(projects)}
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => ({
    events: CommonSelectors.getEvents(state),
    eventsLoading: CommonSelectors.isEventsLoading(state),
    eventsError: CommonSelectors.isEventsError(state),
    getProjects: CommonSelectors.getProjectsForEvent(state),
    isProjectsLoading: CommonSelectors.isProjectsForEventLoading(state),
    isProjectsError: CommonSelectors.isProjectsForEventError(state),
    test: state.common,
});

const mapDispatchToProps = dispatch => ({
    updateEvents: () => dispatch(CommonActions.fetchEvents()),
    updateProjects: (eventId) => dispatch(CommonActions.fetchProjectsForEvent(eventId))
});

export default connect(mapStateToProps, mapDispatchToProps)(Projects);
