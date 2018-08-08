import React, { Component } from 'react';
import PropTypes from 'prop-types';
import '../style.css';
import ReactJson from 'react-json-view';

class ResponsePreview extends Component {
    static propTypes = {
        response: PropTypes.object
    };

    render() {
        return (
            <div className="Test--request-preview">
                <p className="Test--request-preview-title">Response</p>

                {this.props.response ? (
                    <ReactJson src={this.props.response} />
                ) : (
                    <p>Send a request to see the response here</p>
                )}
            </div>
        );
    }
}

export default ResponsePreview;
