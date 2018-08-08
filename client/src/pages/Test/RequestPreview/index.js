import React, { Component } from 'react';
import PropTypes from 'prop-types';
import '../style.css';
import ReactJson from 'react-json-view';

class RequestPreview extends Component {
    static propTypes = {
        url: PropTypes.string,
        body: PropTypes.object
    };

    render() {
        return (
            <div className="Test--request-preview">
                <p className="Test--request-preview-title">Request Preview</p>
                <div className="Test--request-preview-section">
                    <span className="name">Method:</span>
                    <span className="value">{this.props.method}</span>
                </div>
                <div className="Test--request-preview-section">
                    <span className="name">URL:</span>
                    <span className="value">{this.props.url}</span>
                </div>
                <div className="Test--request-preview-section">
                    <span className="name">Params:</span>
                    <ReactJson src={this.props.body} />
                </div>
            </div>
        );
    }
}

export default RequestPreview;
