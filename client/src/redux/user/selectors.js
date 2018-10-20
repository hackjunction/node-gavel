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
