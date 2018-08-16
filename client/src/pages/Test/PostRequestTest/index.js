import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import '../style.css';
import RequestPreview from '../RequestPreview/';
import ResponsePreview from '../ResponsePreview/';

class PostRequestTest extends Component {
    static propTypes = {
        params: PropTypes.arrayOf(
            PropTypes.shape({
                jsonName: PropTypes.string,
                fieldName: PropTypes.string,
                arrayFields: PropTypes.arrayOf(
                    PropTypes.shape({
                        jsonName: PropTypes.string,
                        fieldName: PropTypes.string
                    })
                )
            })
        ),
        route: PropTypes.string,
        routeDescription: PropTypes.string
    };

    constructor(props) {
        super(props);

        this.state = {
            response: null,
            params: {},
            collapsed: true
        };

        this.testRequest = this.testRequest.bind(this);
    }

    async testRequest() {
        const response = await fetch(this.props.route, {
            method: 'POST', // *GET, POST, PUT, DELETE, etc.
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(this.state.params)
        });
        const body = await response.json();

        this.setState({ response: body });
    }

    renderInputs() {
        return _.map(this.props.params, param => {
            if (param.arrayFields) {
                const fields = [];
                const childInputs = _.map(param.arrayFields, field => {
                    fields.push({
                        ref: param.fieldName + '_' + field.fieldName,
                        jsonName: field.jsonName
                    });
                    return (
                        <input
                            key={field.jsonName}
                            ref={param.fieldName + '_' + field.fieldName}
                            placeholder={field.fieldName}
                            className="Test--input"
                        />
                    );
                });

                return (
                    <div className="Test--input-wrapper" key={param.jsonName}>
                        <label className="Test--input-label">{param.fieldName}</label>
                        {childInputs}
                        <button
                            className="Test--button"
                            onClick={() => {
                                console.log(this.state);

                                let obj = {};

                                _.each(fields, field => {
                                    obj[field.jsonName] = this.refs[field.ref].value;
                                });

                                this.setState({
                                    params: {
                                        ...this.state.params,
                                        [param.jsonName]: this.state.params[param.jsonName]
                                            ? _.concat(this.state.params[param.jsonName], obj)
                                            : [obj]
                                    }
                                });
                            }}
                        >
                            Add
                        </button>
                    </div>
                );
            } else {
                return (
                    <div className="Test--input-wrapper" key={param.jsonName}>
                        <label className="Test--input-label">{param.fieldName}</label>
                        <input
                            className="Test--input"
                            placeholder={param.fieldName}
                            onChange={event =>
                                this.setState({
                                    params: {
                                        ...this.state.params,
                                        [param.jsonName]: event.target.value
                                    }
                                })
                            }
                        />
                    </div>
                );
            }
        });
    }

    render() {
        return (
            <div className="Test--section-wrapper">
                <div className="Test--buttons-wrapper">
                    <p className="Test--toolbar-button" onClick={() => this.setState({ response: {}, params: {} })}>
                        Clear
                    </p>
                    <p
                        className="Test--toolbar-button"
                        onClick={() => this.setState({ collapsed: !this.state.collapsed })}
                    >
                        {this.state.collapsed ? 'Expand' : 'Collapse'}
                    </p>
                </div>
                <h1 className="Test--section-title highlight">
                    <span className="Test--method-post">POST</span>
                    {this.props.route}
                </h1>
                <p className="Test--section-description">{this.props.routeDescription}</p>
                <div className={this.state.collapsed ? 'Test--hidden' : ''}>
                    <div className="Test--container">
                        {this.renderInputs()}
                        <button className="Test--submit-button" onClick={this.testRequest}>
                            Send request
                        </button>
                    </div>
                    <div className="Test--container">
                        <RequestPreview method="POST" url={this.props.route} body={this.state.params} />
                    </div>
                    <div className="Test--container">
                        <ResponsePreview response={this.state.response} />
                    </div>
                </div>
            </div>
        );
    }
}

export default PostRequestTest;
