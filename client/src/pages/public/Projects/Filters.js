import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import './Filters.scss';

class Filters extends Component {

	static propTypes = {
		items: PropTypes.arrayOf(PropTypes.shape({
			value: PropTypes.string,
			label: PropTypes.string,
		})),
		selected: PropTypes.string,
		label: PropTypes.string,
		onChange: PropTypes.func.isRequired,
	}

	constructor(props) {
		super(props);

		this.state = {
			expanded: false,
		}

		this.onSelect = this.onSelect.bind(this);
		this.onClear = this.onClear.bind(this);
		this.toggleExpand = this.toggleExpand.bind(this);
	}

	onSelect(item) {
		if (this.props.selected === item.value) {
			this.props.onChange(null);
		} else {
			this.props.onChange(item.value);
		}

		this.setState({
			expanded: false,
		})
	}

	onClear() {
		this.props.onChange(null);
	}

	toggleExpand() {
		this.setState({
			expanded: !this.state.expanded
		});
	}

	getHeaderText() {
		if (this.props.selected) {
			const selected = _.find(this.props.items, (item) => {
				return item.value === this.props.selected;
			});

			return this.props.label + ': ' + selected.label;
		} else {
			return 'Filter by ' + this.props.label;
		}
	}

	renderOptions() {
		return _.map(this.props.items, (item) => {
			const selected = this.props.selected === item.value;
			return (
				<div className={`Filters--Item ${selected ? 'selected' : ''}`} onClick={() => this.onSelect(item)}>
					<span className="Filters--Item_label">{item.label}</span>
				</div>
			);
		});
	}

	render() {
		return (
			<div className="Filters">
				<div className="Filters--Header">
					<div className="Filters--Header_left" onClick={this.toggleExpand}>
						<span className="Filters--Header_label">{this.getHeaderText()}</span>
					</div>
					<div className="Filters--Header_right">
						<div className={`Filters--Header_clear ${this.props.selected ? 'visible' : ''}`} onClick={this.onClear}>
							<i className="fa fa-times"></i>
						</div>
						<div className={`Filters--Header_expand ${this.state.expanded ? 'expanded' : ''}`} onClick={this.toggleExpand}>
							<i className="fas fa-chevron-down"></i>
						</div>
					</div>
				</div>
				<div className={`Filters--Content ${this.state.expanded ? 'expanded' : ''}`}>
					{this.renderOptions()}
				</div>
			</div>
		);
	}
}

export default Filters;