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
