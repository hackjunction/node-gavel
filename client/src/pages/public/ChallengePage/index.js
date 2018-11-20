import React, { Component } from 'react';
import _ from 'lodash';
import './style.scss';

import API from '../../../services/api';

class ChallengePage extends Component {
    constructor(props) {
        super(props);

        this.state = {
            loading: true,
            error: false,
            challenge: null,
            projects: []
        };
    }

    componentDidMount() {
        const { secret, eventId } = this.props.match.params;

        API.getProjectsByChallenge(eventId, secret)
            .then(data => {
                this.setState({
                    challenge: data.challenge,
                    projects: data.projects,
                    loading: false
                });
            })
            .catch(error => {
                this.setState({
                    loading: false,
                    error: true
                });
            });
    }

    renderProjects() {
        const projects = _.sortBy(this.state.projects, 'name');
        return _.map(projects, p => {
            return (
                <div className="ChallengePage--Project">
                    <h4 className="ChallengePage--Project-name">{p.name}</h4>
                    <p className="ChallengePage--Project-punchline">
                        <em>{p.punchline}</em>
                    </p>
                    <p className="ChallengePage--Project-location">
                        <strong>Table:</strong> {p.location}
                    </p>
                    <p className="ChallengePage--Project-contactPhone">
                        <strong>Phone number:</strong> <a href={'tel:' + p.contactPhone}>{p.contactPhone}</a>
                    </p>
                </div>
            );
        });
    }

    render() {
        if (this.state.loading) {
            return (
                <div className="ChallengePage">
                    <div className="ChallengePage--loading">
                        <i className="ChallengePage--spinner fa fa-spinner fa-spin fa-2x" />
                    </div>
                </div>
            );
        }

        if (this.state.error || !this.state.challenge) {
            return (
                <div className="ChallengePage">
                    <div className="ChallengePage--error">
                        <h2 className="ChallengePage--error_title">Oops, something went wrong</h2>
                        <p className="ChallengePage--error_text">
                            This is probably because your link is invalid. Please check that your link is corrent and
                            try again.
                        </p>
                    </div>
                </div>
            );
        }

        return (
            <div className="ChallengePage">
                <div className="ChallengePage--top">
                    <h2 className="ChallengePage--title">{this.state.challenge}</h2>
                    <div className="ChallengePage--separator" />
                    <p className="ChallengePage--subtitle">
                        {this.state.projects.length} teams have submitted this challenge:
                    </p>
                </div>
                {this.renderProjects()}
            </div>
        );
    }
}

export default ChallengePage;
