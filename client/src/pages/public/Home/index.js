import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import moment from 'moment-timezone';
import slugify from 'slugify';
import _ from 'lodash';
import Utils from '../../../services/utils';
import './style.scss';

import * as CommonSelectors from '../../../redux/common/selectors';
import * as CommonActions from '../../../redux/common/actions';

class Home extends Component {

    static propTypes = {
        events: PropTypes.array,
        eventsLoading: PropTypes.bool,
        eventsError: PropTypes.bool,
    }

    componentDidMount() {
        this.props.updateEvents();
    }

    getLink(event) {
        return '/projects/' + Utils.slugify(event.name);
    }

    renderEvents() {
        return _.map(this.props.events, (event) => {
            return (
                <div className="Home--event">
                    <h3 className="Home--event_title">{event.name}<strong>{moment(event.startTime).format('DD.MM.YYYY')} - {moment(event.endTime).format('DD.MM.YYYY')}</strong></h3>
                    <p className="Home--event_stats">{event.challenges.length} Challenges, {event.tracks.length} Tracks</p>
                    <a href={this.getLink(event)}>
                        View submissions
                    </a>
                </div>
            );
        });
    }

    render() {
        return (
            <div className="Home">
                <h1 className="Home--title">Latest events</h1>
                {this.renderEvents()}
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
});

export default connect(mapStateToProps, mapDispatchToProps)(Home);
