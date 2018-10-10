import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class RouteError extends Component {
    render() {
        return (
            <div className="RouteError">
                <i className="fas fa-2x fa-exclamation-circle" />
                <h3 className="RouteError--title">Invalid Link</h3>
                <p className="RouteError--desc">
                    If you've already created a team and are trying to access your team dashboard, you'll find the magic
                    link for that in your email. If you haven't yet created a team, you can do that{' '}
                    <Link className="RouteError--link" to="/teams/create">
                        here
                    </Link>
                </p>
            </div>
        );
    }
}

export default RouteError;
