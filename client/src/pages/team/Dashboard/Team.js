import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import _ from 'lodash';

import * as user from '../../../redux/user/selectors';

class Team extends Component {
    render() {
        const { teamMembers, user } = this.props;

        return (
            <div className="Team">
                <h4>Your team</h4>
                <p>
                    Here you can see all of the members of your team. All team members are able to edit your team's
                    submission. If you wish to add/remove team members, you can do so in the registration platform, and
                    any changes will be updated here.
                </p>
                {_.map(teamMembers, member => {
                    const className =
                        member._id === user._id ? 'TeamDashboard--team-member is-self' : 'TeamDashboard--team-member';
                    return (
                        <div className={className}>
                            <div className="TeamDashboard--team-member-details">
                                <p className="TeamDashboard--team-member-details__name">{member.name}</p>
                                <p className="TeamDashboard--team-member-details__email">{member.email}</p>
                            </div>
                        </div>
                    );
                })}
            </div>
        );
    }
}

const mapStateToProps = state => ({
    teamMembers: user.getTeamMembers(state),
    user: user.getUser(state)
});

const mapDispatchToProps = dispatch => ({});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Team);
