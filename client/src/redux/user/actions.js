import * as ActionTypes from './actionTypes';
import API from '../../services/api';

export const logout = () => dispatch => {
  dispatch({
    type: ActionTypes.LOGOUT
  });
};

export const setUser = user => dispatch => {
  dispatch({
    type: ActionTypes.SET_USER,
    payload: user
  });
};

export const setUserLoading = user => dispatch => {
  dispatch({
    type: ActionTypes.SET_USER_LOADING
  });
};

export const setUserError = () => dispatch => {
  dispatch({
    type: ActionTypes.SET_USER_ERROR
  });
};

export const fetchUser = secret => dispatch => {
  dispatch(setUserLoading());
  return API.getUser(secret)
    .then(user => {
      dispatch(setUser(user));
    })
    .catch(() => {
      dispatch(setUserError());
    });
};

export const setTeamMembers = teamMembers => dispatch => {
  dispatch({
    type: ActionTypes.SET_TEAM_MEMBERS,
    payload: teamMembers
  });
};

export const setTeamMembersLoading = () => dispatch => {
  dispatch({
    type: ActionTypes.SET_TEAM_MEMBERS_LOADING
  });
};

export const setTeamMembersError = () => dispatch => {
  dispatch({
    type: ActionTypes.SET_TEAM_MEMBERS_ERROR
  });
};

export const fetchTeamMembers = secret => dispatch => {
  dispatch(setTeamMembersLoading());
  return API.getTeamMembers(secret)
    .then(teamMembers => {
      dispatch(setTeamMembers(teamMembers));
    })
    .catch(() => {
      dispatch(setTeamMembersError());
    });
};

export const setSubmission = submission => dispatch => {
  dispatch({
    type: ActionTypes.SET_SUBMISSION,
    payload: submission
  });
};

export const setSubmissionLoading = () => dispatch => {
  dispatch({
    type: ActionTypes.SET_SUBMISSION_LOADING
  });
};

export const setSubmissionError = () => dispatch => {
  dispatch({
    type: ActionTypes.SET_SUBMISSION_ERROR
  });
};

export const fetchSubmission = secret => dispatch => {
  dispatch(setSubmissionLoading());
  return API.getSubmission(secret)
    .then(submission => {
      dispatch(setSubmission(submission));
    })
    .catch(() => {
      dispatch(setSubmissionError());
    });
};
