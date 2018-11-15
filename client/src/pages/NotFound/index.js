import React, { Component } from 'react';
import './style.scss';

class NotFound extends Component {
    render() {
        return (
            <div className="NotFound">
                <h1 className="NotFound--title">There's nothing here</h1>
                <p className="NotFound--body">
                    Looks like the page you were looking for doesn't exist. <br /> <br /> You can register your team via
                    the registration platform to access your team's dashboard here. After you've registered your team,
                    we'll also send you a personal login link which you can use to log in to the platform.
                </p>
            </div>
        );
    }
}

export default NotFound;
