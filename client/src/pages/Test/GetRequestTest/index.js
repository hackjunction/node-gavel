import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import '../style.css';
import ReactJson from 'react-json-view';

class GetRequestTest extends Component {
    static propTypes = {
        urlParams: PropTypes.arrayOf(
            PropTypes.shape({
                jsonName: PropTypes.string,
                fieldName: PropTypes.string
            })
        ),
        route: PropTypes.string,
        routeName: PropTypes.string,
        routeDescription: PropTypes.string
    };

    constructor(props) {
        super(props);

        this.state = {
            response: {},
            urlParams: {}
        };

        this.testRequest = this.testRequest.bind(this);
    }

    async testRequest() {
        const response = await fetch(this.props.route + '/' + this.getUrlParams(), {
            method: 'GET', // *GET, POST, PUT, DELETE, etc.
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            }
        });
        const body = await response.json();

        this.setState({ response: body });
    }

    getUrlParams() {
        let urlParams = '';

        if (Object.keys(this.state.urlParams).length === 1) {
            // Regular url param
            _.forOwn(this.state.urlParams, (value, key) => {
                urlParams = value;
            });
        } else {
            // Build query string
            urlParams = '?';
            _.forOwn(this.state.urlParams, (value, key) => {
                urlParams += key + '=' + value + '&';
            });

            urlParams = urlParams.slice(0, -1);
        }

        return urlParams;
    }

    renderInputs() {
        return _.map(this.props.urlParams, param => {
            return (
                <input
                    className="Test--input"
                    placeholder={param.fieldName}
                    onChange={event =>
                        this.setState({
                            urlParams: {
                                ...this.state.urlParams,
                                [param.jsonName]: event.target.value
                            }
                        })
                    }
                />
            );
        });
    }

    renderRequestPreview() {
        let urlParams = this.getUrlParams();

        return (
            <div className="Test--request-preview">
                <div>
                    <p className="Test--request-preview-title">Request preview</p>
                    <code className="Test--request-preview-content">
                        {'GET: ' + this.props.route + '/' + urlParams}
                    </code>
                </div>
                <button className="Test--submit-button" onClick={this.testRequest}>
                    Send Request
                </button>
            </div>
        );
    }

    render() {
        return (
            <div className="Test--section-wrapper">
                <h1 className="Test--section-title highlight">{this.props.routeName + ' (GET ' + this.props.route}</h1>
                <p className="Test--section-description">{this.props.routeDescription}</p>
                <div className="Test--container">{this.renderInputs()}</div>
                <div className="Test--container">{this.renderRequestPreview()}</div>
                <div className="Test--container">
                    <p className="Test--response-preview-title">Response</p>
                    <ReactJson src={this.state.response} />
                </div>
            </div>
        );
    }
}

export default GetRequestTest;
