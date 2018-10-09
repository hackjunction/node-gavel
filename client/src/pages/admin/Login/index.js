import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';

import './style.scss';
import * as admin from '../../../redux/admin/selectors';
import * as AdminActions from '../../../redux/admin/actions';

import SubmitButton from '../../../components/forms/SubmitButton';

class AdminLogin extends Component {
    constructor(props) {
        super(props);

        this.state = {
            username: '',
            password: '',
            error: ''
        };

        this.onSubmit = this.onSubmit.bind(this);
    }

    componentWillMount() {
        this.props.logout();
    }

    onSubmit() {
        this.setState(
            {
                error: ''
            },
            () => {
                this.props.login(this.state.username, this.state.password).catch(error => {
                    this.setState({
                        error: error.message
                    });
                });
            }
        );
    }

    render() {
        if (this.props.isAuthenticated) {
            if (this.props.location && this.props.location.state) {
                if (this.props.location.state.hasOwnProperty('onSuccess')) {
                    return <Redirect to={{ pathname: this.props.location.state.onSuccess }} />;
                }
            }
            return <Redirect to={{ pathname: '/admin' }} />;
        }

        return (
            <div className="AdminLogin">
                <div className="AdminLogin--inner">
                    <h4 className="AdminLogin--title">Administrator Login</h4>
                    {this.state.error ? <p className="AdminLogin--error">{this.state.error}</p> : null}
                    <input
                        className="AdminLogin--input username"
                        placeholder="Username"
                        type="text"
                        value={this.state.username}
                        onChange={e => this.setState({ username: e.target.value })}
                    />
                    <input
                        className="AdminLogin--input password"
                        placeholder="Password"
                        type="password"
                        value={this.state.password}
                        onChange={e => this.setState({ password: e.target.value })}
                    />
                    <SubmitButton
                        text={'Login'}
                        onClick={this.onSubmit}
                        disabled={!this.state.username || !this.state.password}
                    />
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => ({
    isAuthenticated: admin.isLoggedIn(state)
});

const mapDispatchToProps = dispatch => ({
    login: (username, password) => dispatch(AdminActions.login(username, password)),
    logout: () => dispatch(AdminActions.setToken(null))
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(AdminLogin);
