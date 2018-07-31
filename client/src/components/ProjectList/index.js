import React, { Component } from 'react';
import _ from 'lodash';
import './style.css';

class ProjectList extends Component {

	constructor(props) {
		super(props);

		this.state = {
			error: false,
			loading: false,
			items: []
		}
	}

	componentDidMount() {
		this.getProjects();
	}

	getProjects() {
		this.setState({
			loading: true,
			error: false
		}, async () => {
			const response = await fetch('/api/items');
			const body = await response.json();

			if (response.status !== 200) {
				this.setState({
					error: true,
					loading: false,
					items: []
				});
			}
			else {
				this.setState({
					error: false,
					loading: false,
					items: body.data
				});
			}
		});
	}

	renderProjects() {
		return _.map(this.state.items, (project) => {
			return (
				<div key={project._id}>
					<p>{project.name}</p>
				</div>
			);
		});
	}

	render() {
		return (
			<div className="ProjectList--wrapper">
				<h1 className="ProjectList--title">Projects</h1>
				{this.renderProjects()}
			</div>
		);
	}
}

export default ProjectList;