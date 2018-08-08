import React, { Component } from 'react';
import _ from 'lodash';
import '../style.css';
import ReactJson from 'react-json-view';

class AnnotatorSkipTest extends Component {
    constructor(props) {
        super(props);

        this.state = {
            response: {},
            annotatorSecret: ''
        };
    }

    async testRequest() {
        const response = await fetch('/api/reviewing/skip/' + this.state.annotatorSecret, {
            method: 'GET', // *GET, POST, PUT, DELETE, etc.
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            }
        });
        const body = await response.json();

        this.setState({ response: body });
    }

    render() {
        return (
            <div className="Test--section-wrapper">
                <h1 className="Test--section-title">
                    Skip current decision (GET /api/reviewing/skip/:annotatorSecret)
                </h1>
                <p className="Test--section-description">Skip the current decision for an annotator</p>
                <div className="Test--container">
                    <p className="Test--section-description">Annotator details</p>
                    <input
                        className="Test--input"
                        placeholder="Annotator Secret"
                        onChange={event =>
                            this.setState({
                                annotatorSecret: event.target.value
                            })
                        }
                    />
                </div>
                <div className="Test--section-wrapper">
                    <h1 className="Test--section-title">Request:</h1>
                    <p>{'GET: ' + 'api/reviewing/skip/' + this.state.annotatorSecret}</p>
                    <button className="Test--submitButton" onClick={() => this.testRequest()}>
                        Test
                    </button>
                </div>
                <div className="Test--section-wrapper">
                    <h1 className="Test--section-title">Response:</h1>
                    <ReactJson src={this.state.response} />
                </div>
            </div>
        );
    }
}

export default AnnotatorSkipTest;
