import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Switch from 'react-switch';

class SettingsItem extends Component {
    static propTypes = {
        title: PropTypes.string,
        desc: PropTypes.string,
        buttonText: PropTypes.string,
        isPositive: PropTypes.bool,
        onClick: PropTypes.func
    };

    static defaultProps = {
        isPositive: true,
    }

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

    renderButton() {
        const { loading, buttonText } = this.props;
        return (
            <div className="OverviewTab--Settings_item-right">
                {loading ? (
                    <i className="OverviewTab--Settings_item-spinner fas fa-spinner fa-spin" />
                ) : (
                        <button className="OverviewTab--Settings_item-button" onClick={this.onClick}>
                            {buttonText}
                        </button>
                    )}
            </div>
        );
    }

    render() {
        const { title, desc, isPositive } = this.props;
        return (
            <div className={`OverviewTab--Settings_item ${isPositive ? 'positive' : ''}`}>
                <div className="OverviewTab--Settings_item-left">
                    <h4 className="OverviewTab--Settings_item-name">{title}</h4>
                    <p className="OverviewTab--Settings_item-desc">{desc}</p>
                </div>
                <div className="OverviewTab--Settings_item-right">
                    {this.renderButton()}
                </div>
            </div>
        );
    }
}

export default SettingsItem;
