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

        if (teamMember.email && teamMember.name) {
            this.setState({
                requestBody: {
                    ...this.state.requestBody,
                    teamMembers: this.state.requestBody.teamMembers
                        ? _.concat(this.state.requestBody.teamMembers, teamMember)
                        : [teamMember]
                }
            });

            this.refs.teamMemberName.value = '';
            this.refs.teamMemberEmail.value = '';
        }
    }

    async testRequest() {
        const response = await fetch('/api/items', {
            method: 'POST', // *GET, POST, PUT, DELETE, etc.
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(this.state.requestBody)
        });
        const body = await response.json();

        this.setState({ response: body });
    }

    renderTeamMembers() {
        return _.map(this.state.teamMembers, member => {
            return <p key={member.email}>{member.name + ' / ' + member.email}</p>;
        });
    }

    render() {
        return (
            <div className="Test--section-wrapper">
                <h1 className="Test--section-title colored">Submit Team (POST /api/teams)</h1>
                <p className="Test--section-description">Test submitting a project and team members</p>
                <div className="Test--container">
                    <p className="Test--section-description">Team details</p>
                    <input
                        className="Test--input"
                        placeholder="Team name"
                        onChange={event =>
                            this.setState({ requestBody: { ...this.state.requestBody, name: event.target.value } })
                        }
                    />
                    <input
                        className="Test--input"
                        placeholder="Team location"
                        onChange={event =>
                            this.setState({ requestBody: { ...this.state.requestBody, location: event.target.value } })
                        }
                    />
                    <p className="Test--section-description">Add team members</p>
                    <input ref="teamMemberName" className="Test--input" placeholder="Team member name" />
                    <input ref="teamMemberEmail" className="Test--input" placeholder="Team member email" />
                    <button onClick={() => this.addTeamMember()}>Add team member</button>
                </div>
                <div className="Test--section-wrapper">
                    <h1 className="Test--section-title">Request body:</h1>
                    <ReactJson src={this.state.requestBody} />
                    <button className="Test--submitButton" onClick={() => this.testRequest()}>
                        Test
                    </button>
                </div>
                <div className="Test--section-wrapper">
                    <h1 className="Test--section-title">Response:</h1>
                    <ReactJson src={this.state.response} />
                </div>
            </div>
        );
    }
}

export default SubmitProjectTest;
