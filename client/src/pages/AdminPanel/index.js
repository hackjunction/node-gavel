import React, { Component } from 'react';
import ProjectList from '../../components/ProjectList';
import AnnotatorList from '../../components/AnnotatorList';
import './style.css';

class AdminPanel extends Component {
	render() {
		return (
			<div>
				<h1>Admin Panel</h1>
				<ProjectList />
				<AnnotatorList />
			</div>
		);
	}
}

export default AdminPanel;