import moment from 'moment-timezone';

export const getUser = state => state.user.user;
export const isLoading = state => state.user.userLoading;
export const isError = state => state.user.userError;
export const isLoggedIn = state => state.user.user !== null;

export const getTeamMembers = state => state.user.teamMembers || [];
export const isTeamMembersLoading = state => state.user.teamMembersLoading;
export const isTeamMembersError = state => state.user.teamMembersError;

export const getSubmission = state => state.user.submission;
export const isSubmissionLoading = state => state.user.submissionLoading;
export const isSubmissionError = state => state.user.submissionError;

export const getEvent = state => state.user.event || {};
export const isEventLoading = state => state.user.eventLoading;
export const isEventError = state => state.user.eventError;

export const getVotingStartTime = state =>
    state.user.event ? moment(state.user.event.votingStartTime).tz(state.user.event.timezone) : null;
export const getVotingEndTime = state =>
    state.user.event ? moment(state.user.event.votingEndTime).tz(state.user.event.timezone) : null;
export const getNowInEventTime = state => (state.user.event ? moment().tz(state.user.event.timezone) : null);
export const isVotingOpen = state =>
    state.user.event ? getNowInEventTime(state).isBetween(getVotingStartTime(state), getVotingEndTime(state)) : false;

export const getEventStartTime = state =>
    state.user.event ? moment(state.user.event.startTime).tz(state.user.event.timezone) : null;
export const getSubmissionDeadline = state =>
    state.user.event ? moment(state.user.event.submissionDeadline).tz(state.user.event.submissionDeadline) : null;
export const isSubmissionsOpen = state =>
    state.user.event
        ? getNowInEventTime(state).isBetween(getEventStartTime(state), getSubmissionDeadline(state))
        : false;
