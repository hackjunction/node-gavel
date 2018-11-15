import * as ActionTypes from './actionTypes';
import API from '../../services/api';

export const setToken = token => dispatch => {
    dispatch({
        type: ActionTypes.SET_TOKEN,
        payload: token
    });
};

export const setEvent = event => dispatch => {
    dispatch({
        type: ActionTypes.SET_EVENT,
        payload: event
    });
};

export const setEvents = events => dispatch => {
    dispatch({
        type: ActionTypes.SET_EVENTS,
        payload: events
    });
};

export const login = (username, password) => dispatch => {
    return API.adminLogin(username, password).then(token => {
        dispatch(setToken(token));
    });
};

export const fetchEvents = token => dispatch => {
    return API.adminGetEvents(token).then(events => {
        dispatch(setEvents(events));
    });
};

export const fetchEvent = (token, eventId) => dispatch => {
    return API.adminGetEvent(token, eventId).then(event => {
        dispatch(setEvent(event));
    });
};

export const setAnnotatorsForEvent = (eventId, annotators) => dispatch => {
    dispatch({
        type: ActionTypes.SET_ANNOTATORS_FOR_EVENT,
        payload: {
            eventId,
            annotators
        }
    });
};

export const setAnnotatorsLoadingForEvent = eventId => dispatch => {
    dispatch({
        type: ActionTypes.SET_ANNOTATORS_LOADING_FOR_EVENT,
        payload: eventId
    });
};

export const setAnnotatorsErrorForEvent = eventId => dispatch => {
    dispatch({
        type: ActionTypes.SET_ANNOTATORS_ERROR_FOR_EVENT,
        payload: eventId
    });
};

export const fetchAnnotatorsForEvent = (token, eventId) => async dispatch => {
    dispatch(setAnnotatorsLoadingForEvent(eventId));
    return API.adminGetAnnotatorsForEvent(token, eventId)
        .then(annotators => {
            dispatch(setAnnotatorsForEvent(eventId, annotators));
        })
        .catch(error => {
            console.log('fetchAnnotatorsForEvent', error);
            dispatch(setAnnotatorsErrorForEvent(eventId));
        });
};

export const setProjectsForEvent = (eventId, projects) => dispatch => {
    dispatch({
        type: ActionTypes.SET_PROJECTS_FOR_EVENT,
        payload: {
            eventId,
            projects
        }
    });
};

export const setProjectsLoadingForEvent = eventId => dispatch => {
    dispatch({
        type: ActionTypes.SET_PROJECTS_LOADING_FOR_EVENT,
        payload: eventId
    });
};

export const setProjectsErrorForEvent = eventId => dispatch => {
    dispatch({
        type: ActionTypes.SET_PROJECTS_ERROR_FOR_EVENT,
        payload: eventId
    });
};

export const fetchProjectsForEvent = (token, eventId) => dispatch => {
    dispatch(setProjectsLoadingForEvent(token, eventId));
    return API.adminGetProjectsForEvent(token, eventId)
        .then(projects => {
            dispatch(setProjectsForEvent(eventId, projects));
        })
        .catch(error => {
            console.log('fetchProjectsForEvent', error);
            dispatch(setProjectsErrorForEvent(eventId));
        });
};
