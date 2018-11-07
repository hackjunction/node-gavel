import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import './style.scss';

class TabView extends Component {
    static propTypes = {
        tabs: PropTypes.arrayOf(
            PropTypes.shape({
                key: PropTypes.string.isRequired,
                label: PropTypes.string.isRequired,
                renderContent: PropTypes.func.isRequired,
                loading: PropTypes.bool
            })
        ).isRequired,
        activeTab: PropTypes.number.isRequired,
        onTabChange: PropTypes.func.isRequired
    };

    static defaultProps = {
        tabs: [],
        activeTab: 0
    };

    renderLoading() {
        return (
            <div className="TabView--Content_loading">
                <i className="TabView--Content_loading-spinner fas fa-2x fa-spinner fa-spin" />
            </div>
        );
    }

    renderTabs() {
        return _.map(this.props.tabs, (tab, index) => {
            const className = this.props.activeTab === index ? 'TabView--Tab TabView--Tab_active' : 'TabView--Tab';
            return (
                <div key={tab.key} className={className} onClick={() => this.props.onTabChange(index)}>
                    <span className="TabView--Tab_label">{tab.label}</span>
                </div>
            );
        });
    }

    renderContent() {
        const tab = this.props.tabs[this.props.activeTab];

        if (tab.loading) {
            return this.renderLoading();
        } else {
            return tab.renderContent();
        }
    }

    render() {
        if (!Array.isArray(this.props.tabs) || this.props.tabs.length === 0) {
            return null;
        }

        return (
            <div className="TabView">
                <div className="TabView--Tabs">{this.renderTabs()}</div>
                <div className="TabView--Content">{this.renderContent()}</div>
            </div>
        );
    }
}

export default TabView;
