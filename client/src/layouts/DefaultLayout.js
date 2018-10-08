import React from 'react';
import { Route, Link } from 'react-router-dom';
import './style.scss';

const DefaultLayout = ({ component: Component, ...rest }) => {
    return (
        <Route
            {...rest}
            render={matchProps => (
                <div className="Page--Layout">
                    <div className="Page--Header">
                        <h1 className="title">{rest.headerTitle}</h1>
                        <p className="subtitle">{rest.headerSubtitle}</p>
                        {rest.isAdmin ? (
                            <Link className="logout-button" to="/login">
                                Log out
                            </Link>
                        ) : null}
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
    headerTitle: 'GAVEL',
    headerSubtitle: '',
    footerText: 'Copyright Junction 2018',
    isAdmin: false
};

export default DefaultLayout;
