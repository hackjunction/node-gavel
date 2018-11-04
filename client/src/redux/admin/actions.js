import * as ActionTypes from './actionTypes';
import API from '../../services/api';

export const setToken = token => dispatch => {
    dispatch({
        type: ActionTypes.SET_TOKEN,
        payload: token
    });
};

export const setEvents = events => dispatch => {
    dispatch({
        type: ActionTypes.SET_EVENTS,
        payload: events
    });
};

export const login = (username, password) => async dispatch => {
    return API.adminLogin(username, password).then(token => {
        dispatch(setToken(token));
    });
};

export const fetchEvents = token => async dispatch => {
    return API.adminGetEvents(token).then(events => {
        dispatch(setEvents(events));
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
        type: ActionTypes.SET_ANNOTATORS_LOADING_FOR_EVENT
    });
};

export const setAnnotatorsErrorForEvent = eventId => dispatch => {
    dispatch({
        type: ActionTypes.SET_ANNOTATORS_ERROR_FOR_EVENT
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
