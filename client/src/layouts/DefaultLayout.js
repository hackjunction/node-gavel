import React from 'react';
import { Route, Link } from 'react-router-dom';
import './style.scss';

import BackLink from '../components/BackLink';

const DefaultLayout = ({ component: Component, ...rest }) => {
    return (
        <Route
            {...rest}
            render={matchProps => (
                <div className="Page--Layout">
                    <div className="Page--Header">
                        <div className="Page--Header-left">
                            {rest.hasBack ? <BackLink to={rest.backTo} text={rest.backText} /> : null}
                        </div>
                        <div className="Page--Header-center">
                            <div className="Page--Header_branding">
                                <img
                                    className="Page--Header_branding-logo"
                                    alt="Junction"
                                    src={require('../assets/logo_text_white.png')}
                                />
                                <span className="Page--Header_branding-text">Projects</span>
                            </div>
                        </div>
                        <div className="Page--Header-right">
                            {rest.isAdmin ? (
                                <Link className="logout-button" to="/login">
                                    <i class="fas fa-sign-out-alt" />
                                </Link>
                            ) : null}
                        </div>
                    </div>
                    <div className="Page--Content">
                        <Component {...matchProps} />
                    </div>
                    <div className="Page--Footer">
                        <span className="footer-text">{rest.footerText}</span>
                    </div>
                </div>
            )}
        />
    );
};

DefaultLayout.defaultProps = {
    headerSubtitle: '',
    footerText: 'Copyright Junction 2018',
    isAdmin: false
};

export default DefaultLayout;
