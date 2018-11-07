import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './style.scss';

class Banner extends Component {
    static propTypes = {
        type: PropTypes.oneOf(['info, success, error, warning']),
        text: PropTypes.string,
        onClose: PropTypes.func,
        canClose: PropTypes.bool
    };

    renderIcon() {
        switch (this.props.type) {
            case 'info':
                return <i className="Banner--icon fas fa-info-circle" />;
            case 'success':
                return <i className="Banner--icon fas fa-check-circle" />;
            case 'warning':
                return <i className="Banner--icon fas fa-exclamation-triangle" />;
            case 'error':
                return <i className="Banner--icon fas fa-exclamation-circle" />;
            default:
                return null;
        }
    }

    render() {
        return (
            <div className={`Banner Banner--${this.props.type}`}>
                {this.renderIcon()}
                <div className="Banner--content">
                    <p className="Banner--text">{this.props.text}</p>
                </div>
                {this.props.canClose ? (
                    <div className="Banner--close-button" onClick={this.props.onClose}>
                        <i className="Banner--close-icon fas fa-times" />
                    </div>
                ) : null}
            </div>
        );
    }
}

export default Banner;
