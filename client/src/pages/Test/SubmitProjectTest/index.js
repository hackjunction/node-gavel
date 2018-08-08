import React, { Component } from 'react';
import _ from 'lodash';
import '../style.css';
import ReactJson from 'react-json-view';

class SubmitProjectTest extends Component {
    constructor(props) {
        super(props);

        this.state = {
            teamMembers: [],
            response: {},
            requestBody: {}
        };
    }

    addTeamMember() {
        const teamMember = {
            name: this.refs.teamMemberName.value,
            email: this.refs.teamMemberEmail.value
        };
    }

    addAnnotator() {
        const annotator = {
            name: this.refs.annotatorName.value,
            email: this.refs.annotatorEmail.value
        };

        if (annotator.email && annotator.name) {
            this.setState({
                requestBody: {
                    ...this.state.requestBody,
                    annotators: this.state.requestBody.annotators
                        ? _.concat(this.state.requestBody.annotators, annotator)
                        : [annotator]
                }
            });

            this.refs.annotatorName.value = '';
            this.refs.annotatorEmail.value = '';
        }
    }

    async testRequest() {
        const response = await fetch('/api/teams', {
            method: 'POST', // *GET, POST, PUT, DELETE, etc.
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(this.state.requestBody)
        });
        console.log(response);
        const body = await response.json();
        this.setState({ response: body });
    }

    render() {
        return (
            <div className="Test--section-wrapper">
                <h1 className="Test--section-title highlight">Submit Project (POST /api/teams/)</h1>
                <p className="Test--section-description">Test submitting a project and team members</p>
                <div className="Test--container">
                    <p className="Test--section-description">Team details</p>
                    <input
                        className="Test--input"
                        placeholder="Team name"
                        onChange={event =>
                            this.setState({ requestBody: { ...this.state.requestBody, itemName: event.target.value } })
                        }
                    />
                    <input
                        className="Test--input"
                        placeholder="Team location"
                        onChange={event =>
                            this.setState({
                                requestBody: { ...this.state.requestBody, itemLocation: event.target.value }
                            })
                        }
                    />
                    <p className="Test--section-description">Add team members</p>
                    <input ref="annotatorName" className="Test--input" placeholder="Annotator name" />
                    <input ref="annotatorEmail" className="Test--input" placeholder="Annotator email" />
                    <button className="Test--submit-button" onClick={() => this.addAnnotator()}>
                        Add team member
                    </button>
                    <p className="Test--section-description">Request body</p>
                    <ReactJson src={this.state.requestBody} />
                    <button className="Test--submit-button" onClick={() => this.testRequest()}>
                        Test
                    </button>
                    <p className="Test--section-description">Response</p>
                    <ReactJson src={this.state.response} />
                </div>
            </div>
        );
    }
}

export default SubmitProjectTest;
