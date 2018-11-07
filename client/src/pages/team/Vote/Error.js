import React, { Component } from 'react';
import './style.scss';

class VoteError extends Component {
    render() {
        return (
            <div className="Vote">
                <h1>Oops, something went wrong...</h1>
                <p>Please reload the page.</p>
            </div>
        );
    }
}

export default VoteError;
