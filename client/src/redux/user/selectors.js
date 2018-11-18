import moment from 'moment-timezone';

export const getUser = state => state.user.user;
export const isLoading = state => state.user.userLoading;
export const isError = state => state.user.userError;
export const isLoggedIn = state => state.user.user !== null;

export const getTeamMembers = state => state.user.teamMembers || [];
export const isTeamMembersLoading = state => state.user.teamMembersLoading;
export const isTeamMembersError = state => state.user.teamMembersError;

export const getSubmission = state => state.user.submission || {};
export const isSubmissionLoading = state => state.user.submissionLoading;
export const isSubmissionError = state => state.user.submissionError;
export const hasSubmitted = state => state.user.submission && state.user.submission.hasOwnProperty('_id');

export const getEvent = state => state.user.event || {};
export const isEventLoading = state => state.user.eventLoading;
export const isEventError = state => state.user.eventError;

export const getVotingStartTime = state =>
    state.user.event ? moment(state.user.event.votingStartTime).tz(state.user.event.timezone) : null;
export const getVotingEndTime = state =>
    state.user.event ? moment(state.user.event.votingEndTime).tz(state.user.event.timezone) : null;
export const getTimezone = state => (state.user.event ? state.user.event.timezone : null);

export const getNowInEventTime = state => () => {
    if (!state.user.event) {
        return moment();
    }
    return moment().tz(state.user.event.timezone);
};

export const isVotingOpen = state => () => {
    if (!state.user.event) {
        return false;
    }
    const now = getNowInEventTime(state);
    return now().isBetween(getVotingStartTime(state), getVotingEndTime(state));
};

export const getEventStartTime = state =>
    state.user.event ? moment(state.user.event.startTime).tz(state.user.event.timezone) : null;
export const getSubmissionDeadline = state =>
    state.user.event ? moment(state.user.event.submissionDeadline).tz(state.user.event.timezone) : null;

export const isSubmissionsOpen = state => () => {
    if (!state.user.event) {
        return false;
    }
    const now = getNowInEventTime(state);
    return now().isBetween(getEventStartTime(state), getSubmissionDeadline(state));
};
