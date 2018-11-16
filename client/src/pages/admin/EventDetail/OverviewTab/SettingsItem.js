import React, { Component } from 'react';
import PropTypes from 'prop-types';

class SettingsItem extends Component {
    static propTypes = {
        title: PropTypes.string,
        desc: PropTypes.string,
        buttonText: PropTypes.string,
        onClick: PropTypes.func
    };

    constructor(props) {
        super(props);
        this.state = {
            loading: false
        };

        this.onClick = this.onClick.bind(this);
    }

    onClick() {
        this.setState(
            {
                loading: true
            },
            () => {
                this.props.onClick().then(() => {
                    this.setState({
                        loading: false
                    });
                });
            }
        );
    }

    render() {
        const { title, desc, buttonText } = this.props;
        const { loading } = this.state;
        return (
            <div className="OverviewTab--Settings_item">
                <div className="OverviewTab--Settings_item-left">
                    <h4 className="OverviewTab--Settings_item-name">{title}</h4>
                    <p className="OverviewTab--Settings_item-desc">{desc}</p>
                </div>
                <div className="OverviewTab--Settings_item-right">
                    {loading ? (
                        <i className="OverviewTab--Settings_item-spinner fas fa-spinner fa-spin" />
                    ) : (
                        <button className="OverviewTab--Settings_item-button" onClick={this.onClick}>
                            {buttonText}
                        </button>
                    )}
                </div>
            </div>
        );
    }
}

export default SettingsItem;
