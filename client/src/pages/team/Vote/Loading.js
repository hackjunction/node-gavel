import React, { Component } from 'react';
import './style.scss';

class VoteLoading extends Component {
    render() {
        return (
            <div className="Vote">
                <i className="Vote--spinner fas fa-2x fa-spinner fa-spin" />
            </div>
        );
    }
}

export default VoteLoading;
