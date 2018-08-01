import React, { Component } from 'react';
import _ from 'lodash';
import '../style.css';
import ReactJson from 'react-json-view'

class SubmitProjectTest extends Component {

	constructor(props) {
		super(props);

		this.state = {
			teamMembers: [],
			response: {}
		}
	}

	addTeamMember() {

		const teamMember = {
			name: this.refs.teamMemberName.value,
			email: this.refs.teamMemberEmail.value
		};

		if (teamMember.email && teamMember.name) {
			this.setState({
				teamMembers: _.concat(this.state.teamMembers, teamMember)
			});

			this.refs.teamMemberName.value = '';
			this.refs.teamMemberEmail.value = '';
		}
	}

	async testRequest() {
		const response = await fetch('/api/items', {
			method: "POST", // *GET, POST, PUT, DELETE, etc.
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				name: 'Foofoo team',
				location: 'A5'
			})
		});
		const body = await response.json();

		this.setState({ response: body });
	}

	renderTeamMembers() {
		return _.map(this.state.teamMembers, (member) => {
			return <p key={member.email}>{member.name + ' / ' + member.email}</p>
		})
	}

	render() {
		return (
			<div className="Test--section-wrapper">
				<h1 className="Test--section-title">Submit Project Test</h1>
				<p className="Test--section-description">Test submitting a project and team members</p>
				<div className="Test--container">
					<p className="Test--section-description">Team details</p>
					<input className="Test--input" placeholder="Team name"></input>
					<input className="Test--input" placeholder="Team location"></input>
					<p className="Test--section-description">Add team members</p>
					<input ref="teamMemberName" className="Test--input" placeholder="Team member name"></input>
					<input ref="teamMemberEmail" className="Test--input" placeholder="Team member email"></input>
					<button onClick={() => this.addTeamMember()}>Add team member</button>
					{this.renderTeamMembers()}
				</div>
				<button className="Test--submitButton" onClick={() => this.testRequest()}>Test</button>
				<div className="Test--section-wrapper">
					<h1 className="Test--section-title">Response:</h1>
					<ReactJson src={this.state.response} />
				</div>
			</div>
		);
	}
}

export default SubmitProjectTest;