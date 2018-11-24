import React, { Component } from 'react';
import PropTypes from 'prop-types';

import ImageInput from '../../../components/forms/ImageInput';

class Test extends Component {

	constructor(props) {
		super(props);

		this.state = {
			url: null,
		}
	}

	render() {
		return (
			<div>
				<ImageInput value={this.state.url} onChange={(url) => this.setState({ url })} />
			</div>
		);
	}
}

export default Test;