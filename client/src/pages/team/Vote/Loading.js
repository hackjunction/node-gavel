import React, { Component } from 'react';
import './style.scss';

class VoteLoading extends Component {
    render() {
        return (
            <div className="Vote">
                <div className="Vote--loading">
                    <i className="Vote--spinner fas fa-2x fa-spinner fa-spin" />
                </div>
            </div>
        );
    }
}

export default VoteLoading;
