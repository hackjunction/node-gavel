import * as ActionTypes from './actionTypes';

const initialState = {
  user: null,
  userLoading: false,
  userError: false,
  teamMembers: null,
  teamMembersLoading: false,
  teamMembersError: false,
  submission: null,
  submissionLoading: false,
  submissionError: false
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case ActionTypes.LOGOUT:
      return initialState;
    case ActionTypes.SET_USER:
      return {
        ...state,
        user: action.payload,
        userLoading: false
      };
    case ActionTypes.SET_USER_LOADING:
      return {
        ...state,
        userLoading: true,
        userError: false
      };
    case ActionTypes.SET_USER_ERROR:
      return {
        ...state,
        userLoading: false,
        userError: true,
        user: null
      };
    case ActionTypes.SET_TEAM_MEMBERS:
      return {
        ...state,
        teamMembers: action.payload,
        teamMembersLoading: false
      };
    case ActionTypes.SET_TEAM_MEMBERS_LOADING:
      return {
        ...state,
        teamMembersLoading: true,
        teamMembersError: false
      };
    case ActionTypes.SET_TEAM_MEMBERS_ERROR:
      return {
        ...state,
        teamMembersLoading: false,
        teamMembersError: true
      };
    case ActionTypes.SET_SUBMISSION:
      return {
        ...state,
        submission: action.payload,
        submissionLoading: false
      };
    case ActionTypes.SET_SUBMISSION_LOADING:
      return {
        ...state,
        submissionLoading: true,
        submissionError: false
      };
    case ActionTypes.SET_SUBMISSION_ERROR:
      return {
        ...state,
        submissionLoading: false,
        submissionError: true
      };
    default:
      return state;
  }
}
