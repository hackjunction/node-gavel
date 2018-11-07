import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import './style.scss';

import Banner from '../Banner';

class BannerManager extends Component {
    static propTypes = {
        banners: PropTypes.array
    };

    constructor(props) {
        super(props);

        if (this.props.banners) {
        }

        this.state = {
            banners: this.props.banners
                ? _.map(this.props.banners, (b, index) => {
                      return {
                          data: b,
                          key: index,
                          status: 2
                      };
                  })
                : []
        };
    }

    sleep(ms) {
        return new Promise(function(resolve, reject) {
            setTimeout(function() {
                resolve();
            }, ms);
        });
    }

    setStatus(key, status) {
        this.setState({
            banners: _.map(this.state.banners, banner => {
                if (banner.key === key) {
                    banner.status = status;
                }

                return banner;
            })
        });
    }

    async addBanner(bannerProps, key, autoClose) {
        this.setState({
            banners: _.concat(this.state.banners, {
                data: bannerProps,
                key,
                status: 0
            })
        });

        await this.sleep(1);
        this.setStatus(key, 1);
        await this.sleep(300);
        this.setStatus(key, 2);

        if (autoClose) {
            setTimeout(
                function() {
                    this.removeBanner(key);
                }.bind(this),
                autoClose
            );
        }
    }

    async removeBanner(key) {
        this.setStatus(key, 1);
        await this.sleep(300);
        this.setStatus(key, 0);
        await this.sleep(300);
        this.setState({
            banners: _.filter(this.state.banners, b => b.key !== key)
        });
    }

    renderBanners() {
        return _.map(this.state.banners, banner => {
            return (
                <div key={banner.key} className={`BannerManager--item status-${banner.status}`}>
                    <Banner {...banner.data} onClose={() => this.removeBanner(banner.key)} />
                </div>
            );
        });
    }

    render() {
        return <div className="BannerManager">{this.renderBanners()}</div>;
    }
}

export default BannerManager;
