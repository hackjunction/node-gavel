import React, { Component } from 'react';

import Banner from '../../../components/Banner';
import BannerManager from '../../../components/BannerManager';

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
            <div>
                <h1 onClick={() => this.addBanner()}>Add</h1>
                <BannerManager ref={ref => (this.bannerManager = ref)} />
                <h1>Test</h1>
            </div>
        );
    }
}

export default Home;
