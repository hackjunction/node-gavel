import React, { Component } from 'react';
import SubmitProjectTest from './SubmitProjectTest';
import GetRequestTest from './GetRequestTest';
import './style.css';

class Test extends Component {
    render() {
        return (
            <div className="Test--wrapper">
                <SubmitProjectTest />
                <GetRequestTest
                    route="/api/reviewing/welcome"
                    routeName="Read annotator welcome"
                    routeDescription="Sets the annotator welcome message as read"
                    urlParams={[
                        {
                            jsonName: 'annotatorSecret',
                            fieldName: 'Annotator Secret'
                        }
                    ]}
                />
                <GetRequestTest
                    route="/api/reviewing/next"
                    routeName="Get next decision"
                    routeDescription="Gets the next decision for an annotator"
                    urlParams={[
                        {
                            jsonName: 'annotatorSecret',
                            fieldName: 'Annotator Secret'
                        }
                    ]}
                />
                <GetRequestTest
                    route="/api/reviewing/skip"
                    routeName="Skip next decision"
                    routeDescription="Skips the next decision of an annotator"
                    urlParams={[
                        {
                            jsonName: 'annotatorSecret',
                            fieldName: 'Annotator Secret'
                        }
                    ]}
                />
            </div>
        );
    }
}

export default Test;
