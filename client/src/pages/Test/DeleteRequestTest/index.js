import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import '../style.css';
import RequestPreview from '../RequestPreview/';
import ResponsePreview from '../ResponsePreview/';

class DeleteRequestTest extends Component {
    static propTypes = {
        urlParams: PropTypes.arrayOf(
            PropTypes.shape({
                jsonName: PropTypes.string,
                fieldName: PropTypes.string
            })
        ),
        route: PropTypes.string,
        routeDescription: PropTypes.string
    };

    constructor(props) {
        super(props);

        this.state = {
            response: {},
            urlParams: {},
            collapsed: true
        };

        this.testRequest = this.testRequest.bind(this);
    }

    async testRequest() {
        const response = await fetch(this.props.route + '/' + this.getUrlParams(), {
            method: 'DELETE', // *GET, POST, PUT, DELETE, etc.
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
                <div className="Test--input-wrapper">
                    <label className="Test--input-label">{param.fieldName}</label>
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
                </div>
            );
        });
    }

    render() {
        const url = this.props.route + '/' + this.getUrlParams();

        return (
            <div className="Test--section-wrapper">
                <p
                    className="Test--collapse-button"
                    onClick={() => this.setState({ collapsed: !this.state.collapsed })}
                >
                    {this.state.collapsed ? 'Expand' : 'Collapse'}
                </p>
                <h1 className="Test--section-title highlight">
                    <span className="Test--method-delete">DELETE</span>
                    {this.props.route}
                </h1>
                <p className="Test--section-description">{this.props.routeDescription}</p>
                <div className={this.state.collapsed ? 'Test--hidden' : ''}>
                    <div className="Test--container">{this.renderInputs()}</div>
                    <div className="Test--container">
                        <RequestPreview method="DELETE" url={url} />
                    </div>
                    <div className="Test--container">
                        <ResponsePreview response={this.state.response} />
                    </div>
                    <button className="Test--submit-button" onClick={this.testRequest}>
                        Send request
                    </button>
                </div>
            </div>
        );
    }
}

export default DeleteRequestTest;
