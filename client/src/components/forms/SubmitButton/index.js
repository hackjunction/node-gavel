import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './style.scss';

class SubmitButton extends Component {
  static propTypes = {
    text: PropTypes.string,
    onClick: PropTypes.func,
    loading: false,
    hidden: false,
    disabled: false,
    type: PropTypes.string
  };

  static defaultProps = {
    type: 'large'
  };

  constructor(props) {
    super(props);

    this.state = {
      loading: false
    };
  }

  render() {
    let className = 'SubmitButton';

    if (this.props.size) {
      className += ` SubmitButton-size-${this.props.size}`;
    }
    if (this.props.align) {
      className += ` SubmitButton-align-${this.props.align}`;
    }
    if (this.props.loading) {
      className += ' loading';
    }

    if (this.props.hidden) {
      className += ' hidden';
    }

    return (
      <div className={className}>
        <button
          className="SubmitButton--button"
          onClick={this.props.onClick}
          disabled={this.props.disabled}
        >
          <span className="SubmitButton--text">{this.props.text}</span>
          <i class="SubmitButton--spinner fas fa-spinner fa-spin" />
        </button>
      </div>
    );
  }
}

export default SubmitButton;
