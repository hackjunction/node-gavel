import * as ActionTypes from './actionTypes';
import API from '../../services/api';
import Utils from '../../services/utils';

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

export const setUserLoading = () => dispatch => {
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

export const initAnnotator = secret => dispatch => {
    dispatch(setUserLoading());
    return API.initAnnotator(secret).then(user => {
        dispatch(setUser(user));
    });
};

export const setOnboarded = secret => dispatch => {
    dispatch(setUserLoading());
    return API.setAnnotatorOnboarded(secret).then(user => {
        dispatch(setUser(user));
    });
};

export const submitVote = (secret, choice, minDelay = 0) => dispatch => {
    dispatch(setUserLoading());
    return Utils.minDelay(API.submitVote(secret, choice), minDelay).then(user => {
        dispatch(setUser(user));
    });
};

export const setEvent = event => dispatch => {
    dispatch({
        type: ActionTypes.SET_EVENT,
        payload: event
    });
};

export const setEventLoading = () => dispatch => {
    dispatch({
        type: ActionTypes.SET_EVENT_LOADING
    });
};

export const setEventError = () => dispatch => {
    dispatch({
        type: ActionTypes.SET_EVENT_ERROR
    });
};

export const fetchEvent = secret => dispatch => {
    dispatch(setEventLoading());

    return API.getUserEvent(secret)
        .then(event => {
            dispatch(setEvent(event));
        })
        .catch(error => {
            dispatch(setEventError());
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

export const addTeamMember = (name, email, secret) => dispatch => {
    dispatch(setTeamMembersLoading());
    return API.addTeamMember(name, email, secret)
        .then(teamMembers => {
            dispatch(setTeamMembers(teamMembers));
        })
        .catch(() => {
            dispatch(setTeamMembersError());
        });
};

export const removeTeamMember = (_id, secret) => dispatch => {
    dispatch(setTeamMembersLoading());
    return API.removeTeamMember(_id, secret)
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

export const editSubmission = (field, value) => dispatch => {
    dispatch({
        type: ActionTypes.EDIT_SUBMISSION,
        payload: {
            field,
            value
        }
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

export const saveSubmission = (project, secret, minDelay = 0) => dispatch => {
    dispatch(setSubmissionLoading());

    return Utils.minDelay(API.updateSubmission(project, secret), minDelay)
        .then(submission => {
            console.log('DONE', Date.now());
            dispatch(setSubmission(submission));
            return Promise.resolve('foofee');
        })
        .catch(() => {
            dispatch(setSubmissionError());
            return Promise.reject('feefoo');
        });
};
