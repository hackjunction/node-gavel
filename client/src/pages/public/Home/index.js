import React, { Component } from 'react';
import './style.scss';

class Home extends Component {
    addBanner() {
        this.bannerManager.addBanner(
            {
                type: 'info',
                text: 'Submissions are open! The submission deadline is Sunday 2pm',
                canClose: true
            },
            Date.now()
        );
    }

    render() {
        return (
            <div className="Home">
                <img
                    alt="Junction logo"
                    className="Home--logo"
                    src={require('../../../assets/logo_emblem_white.png')}
                />
                <h1 className="Home--title">Welcome to the Junction project platform</h1>
                <p className="Home--body">
                    When participating at a Junction event, this is where you'll submit your project, and participate in
                    peer-reviewing. If you haven't already received your personal login link, please register your team
                    in the registration platform. If you've already done that, you can access your team dashboard via
                    the registration platform, or by opening your personal login link that we sent you by email.
                </p>
            </div>
        );
    }
}

export default Home;
