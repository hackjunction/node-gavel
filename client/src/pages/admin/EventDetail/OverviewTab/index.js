import React, { Component } from 'react';
import PropTypes from 'prop-types';

import './style.scss';

class OverviewTab extends Component {
    static propTypes = {
        annotators: PropTypes.array,
        projects: PropTypes.array,
        event: PropTypes.object,
        loading: PropTypes.bool,
        error: PropTypes.bool
    };

    render() {
        return (
            <React.Fragment>
                <h4>Cool graphs and stuff here</h4>
                <p>Projects: {this.props.projects.length}</p>
                <p>Annotators: {this.props.annotators.length}</p>
                <p>Event: {this.props.event.name}</p>
            </React.Fragment>
        );
    }
}

export default OverviewTab;
