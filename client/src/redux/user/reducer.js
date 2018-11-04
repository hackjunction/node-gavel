import * as ActionTypes from './actionTypes';
import { ifStatement } from 'babel-types';

const initialState = {
    user: null,
    userLoading: false,
    userError: false,
    event: null,
    eventLoading: false,
    eventError: false,
    teamMembers: [],
    teamMembersLoading: false,
    teamMembersError: false,
    submission: {},
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
        case ActionTypes.SET_EVENT:
            return {
                ...state,
                eventLoading: false,
                eventError: false,
                event: action.payload
            };
        case ActionTypes.SET_EVENT_LOADING:
            return {
                ...state,
                eventLoading: true,
                eventError: false
            };
        case ActionTypes.SET_EVENT_ERROR:
            return {
                ...state,
                eventLoading: false,
                eventError: true
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
        case ActionTypes.EDIT_SUBMISSION:
            return {
                ...state,
                submission: {
                    ...state.submission,
                    [action.payload.field]: action.payload.value
                }
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
