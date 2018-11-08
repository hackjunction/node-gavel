import React, { Component } from 'react';
import { connect } from 'react-redux';
import './style.scss';
import * as UserSelectors from '../../../redux/user/selectors';
import * as UserActions from '../../../redux/user/actions';

import VoteWelcome from './Welcome';
import VoteError from './Error';
import VoteLoading from './Loading';
import VoteWait from './Wait';
import ProjectBlock from './ProjectBlock';

class Vote extends Component {
    constructor(props) {
        super(props);

        this.init = this.init.bind(this);
    }

    componentDidMount() {
        this.props.updateUser(this.props.user.secret);
        this.props.updateEvent(this.props.user.secret);
    }

    init() {
        const { user, initAnnotator } = this.props;
        initAnnotator(user.secret).catch(() => {
            window.alert('Error on init!');
        });
    }

    renderTop() {
        const { user } = this.props;

        if (user.next && user.prev) {
            return (
                <div className="Vote--Top">
                    <h4>Which project is better?</h4>
                    <p>
                        Go to the next project and watch their demo. After you've done that, choose if it was better or
                        worse than the project you saw immediately before it.
                    </p>
                </div>
            );
        }

        if (user.next) {
            return (
                <div className="Vote--Top">
                    <h4>Go see your first project</h4>
                    <p>
                        After you've watched their demo, press <strong>DONE</strong>
                    </p>
                </div>
            );
        }

        return null;
    }

    renderButtons() {
        const { user } = this.props;
        if (user.next && user.prev) {
            return (
                <div className="Vote--Bottom">
                    <p className="Vote--Bottom_title">Which project was better?</p>
                    <div className="Vote--Bottom_buttons">
                        <div className="Vote--Button">
                            <p className="Vote--Button_text">Previous</p>
                        </div>
                        <div className="Vote--Button">
                            <p className="Vote--Button_text">Current</p>
                        </div>
                    </div>
                    <div className="Vote--Skip">
                        <p>I can't find this project</p>
                    </div>
                </div>
            );
        }

        if (user.next) {
            return (
                <div className="Vote--Bottom">
                    <p className="Vote--Bottom_title">After you've seen the demo, click DONE</p>
                    <div className="Vote--Bottom_buttons">
                        <div className="Vote--Button">
                            <p className="Vote--Button_text">Done</p>
                        </div>
                    </div>
                    <div className="Vote--Skip">
                        <p>I can't find this project</p>
                    </div>
                </div>
            );
        }

        return null;
    }

    render() {
        const { user, userLoading, userError, event, eventLoading, eventError } = this.props;

        if (userLoading || eventLoading) {
            return <VoteLoading />;
        }

        if (userError || eventError) {
            return <VoteError />;
        }

        if (!user.read_welcome) {
            return <VoteWelcome user={user} event={event} loading={userLoading} onContinue={this.init} />;
        }

        if (!user.next) {
            return <VoteWait />;
        }

        return (
            <div className="Vote">
                {this.renderTop()}
                {user.prev ? <ProjectBlock projectId={user.prev} isCurrent={false} /> : null}
                {user.next ? <ProjectBlock projectId={user.next} isCurrent={true} /> : null}
                {this.renderButtons()}
            </div>
        );
    }
}

const mapStateToProps = state => ({
    user: UserSelectors.getUser(state),
    userLoading: UserSelectors.isLoading(state),
    userError: UserSelectors.isError(state),
    event: UserSelectors.getEvent(state),
    eventLoading: UserSelectors.isEventLoading(state),
    eventError: UserSelectors.isEventError(state)
});

const mapDispatchToProps = dispatch => ({
    initAnnotator: secret => dispatch(UserActions.initAnnotator(secret)),
    updateUser: secret => dispatch(UserActions.fetchUser(secret)),
    updateEvent: secret => dispatch(UserActions.fetchEvent(secret))
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Vote);
