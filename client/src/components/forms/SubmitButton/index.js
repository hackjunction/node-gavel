import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import './style.scss';

class SubmitButton extends Component {
    static propTypes = {
        text: PropTypes.string,
        onClick: PropTypes.func,
        loading: PropTypes.bool,
        hidden: PropTypes.bool,
        disabled: PropTypes.bool,
        isLink: PropTypes.bool,
        linkTo: PropTypes.bool,
        small: PropTypes.bool,
        alignRight: PropTypes.bool
    };

    static defaultProps = {
        loading: false,
        hidden: false,
        disabled: false,
        isLink: false
    };

    render() {
        const { disabled, loading, hidden, onClick, text, isLink, linkTo, small, alignRight } = this.props;

        if (isLink) {
            let className = 'SubmitButton';

            if (disabled) {
                className += ' disabled';
            }

            return (
                <div className={className}>
                    <Link className="SubmitButton--button" to={linkTo}>
                        <span className="SubmitButton--text">{text}</span>
                    </Link>
                </div>
            );
        } else {
            let className = 'SubmitButton';

            if (disabled) {
                className += ' disabled';
            }

            if (loading) {
                className += ' loading';
            }

            if (hidden) {
                className += ' hidden';
            }

            if (small) {
                className += ' small';
            }

            if (alignRight) {
                className += ' alignRight';
            }

            return (
                <div className={className}>
                    <button className="SubmitButton--button" onClick={onClick} disabled={disabled}>
                        <span className="SubmitButton--text">{text}</span>
                        <i class="SubmitButton--spinner fas fa-spinner fa-spin" />
                    </button>
                </div>
            );
        }
    }
}

export default SubmitButton;
