import React, { Component } from 'react';
import GetRequestTest from './GetRequestTest';
import PostRequestTest from './PostRequestTest';
import './style.css';
import DeleteRequestTest from './DeleteRequestTest';

class Test extends Component {
    render() {
        return (
            <div className="Test--wrapper">
                <PostRequestTest
                    route="/api/teams"
                    routeDescription="Submit a project & associated team members"
                    params={[
                        {
                            jsonName: 'teamName',
                            fieldName: 'Team Name'
                        },
                        {
                            jsonName: 'teamLocation',
                            fieldName: 'Team Location'
                        },
                        {
                            jsonName: 'annotators',
                            fieldName: 'Annotators',
                            arrayFields: [
                                {
                                    jsonName: 'name',
                                    fieldName: 'Annotator name'
                                },
                                {
                                    jsonName: 'email',
                                    fieldName: 'Annotator email'
                                }
                            ]
                        }
                    ]}
                />
                <GetRequestTest
                    route="/api/teams"
                    routeDescription="Gets a team by id"
                    urlParams={[
                        {
                            jsonName: 'teamId',
                            fieldName: 'A teams Id'
                        }
                    ]}
                />

                <GetRequestTest
                    route="/api/reviewing/welcome"
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
                    routeDescription="Skips the next decision of an annotator"
                    urlParams={[
                        {
                            jsonName: 'annotatorSecret',
                            fieldName: 'Annotator Secret'
                        }
                    ]}
                />
                <PostRequestTest
                    route="/api/reviewing/vote"
                    routeDescription="Submits a vote, and returns the updated annotator"
                    params={[
                        {
                            jsonName: 'annotatorSecret',
                            fieldName: 'Annotator Secret'
                        },
                        {
                            jsonName: 'decision',
                            fieldName: "Decision ('current' or 'previous')"
                        }
                    ]}
                />
                <DeleteRequestTest route="/api/teams" routeDescription="Deletes a team" urlParams={[]} />
            </div>
        );
    }
}

export default Test;
