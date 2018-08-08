import React, { Component } from 'react';
import _ from 'lodash';
import '../style.css';
import ReactJson from 'react-json-view'

class SubmitProjectTest extends Component {

	constructor(props) {
		super(props);

		this.state = {
			teamMembers: [],
			response: {},
			requestBody: {}
		}
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
					annotators: this.state.requestBody.annotators ? _.concat(this.state.requestBody.annotators, annotator) : [annotator]
				}
			});

			this.refs.annotatorName.value = '';
			this.refs.annotatorEmail.value = '';
		}
	}

	// async testRequest() {
	// 	const response = await fetch('/api/items', {
	// 		method: "POST", // *GET, POST, PUT, DELETE, etc.
	// 		headers: {
	// 			'Accept': 'application/json',
	// 			'Content-Type': 'application/json'
	// 		},
	// 		body: JSON.stringify(this.state.requestBody)
	// 	});
	// 	const body = await response.json();
	//
	// 	this.setState({ response: body });
	// }

	async testRequest() {
		const response = await fetch('/api/teams', {
			method: "POST", // *GET, POST, PUT, DELETE, etc.
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(this.state.requestBody)
		});
		console.log(response)
		const body = await response.json();
		this.setState({ response: body });
	}

	render() {
		return (
			<div className="Test--section-wrapper">
				<h1 className="Test--section-title">Submit Project Test</h1>
				<p className="Test--section-description">Test submitting a project and team members</p>
				<div className="Test--container">
					<p className="Test--section-description">Team details</p>
					<input
						className="Test--input"
						placeholder="Team name"
						onChange={(event) => this.setState({ requestBody: { ...this.state.requestBody, itemName: event.target.value } })}
					/>
					<input
						className="Test--input"
						placeholder="Team location"
						onChange={(event) => this.setState({ requestBody: { ...this.state.requestBody, itemLocation: event.target.value } })}
					/>
					<p className="Test--section-description">Add team members</p>
					<input ref="annotatorName" className="Test--input" placeholder="Annotator name"></input>
					<input ref="annotatorEmail" className="Test--input" placeholder="Annotator email"></input>
					<button onClick={() => this.addAnnotator()}>Add team member</button>
				</div>
				<div className="Test--section-wrapper">
					<h1 className="Test--section-title">Request body:</h1>
					<ReactJson src={this.state.requestBody} />
					<button className="Test--submitButton" onClick={() => this.testRequest()}>Test</button>
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
