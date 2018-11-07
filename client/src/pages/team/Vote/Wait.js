import React, { Component } from 'react';
import './style.scss';

class VoteWait extends Component {
    render() {
        return (
            <div className="Vote">
                <h1>No projects currently available</h1>
                <p>
                    If you've already looked at all of the projects, you are done! Otherwise, this means that all of the
                    remaining projects for you to judge are currently busy. Please wait a few minutes and reload the
                    page to try again.
                </p>
            </div>
        );
    }
}

export default VoteWait;
