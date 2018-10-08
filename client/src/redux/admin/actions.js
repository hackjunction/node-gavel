import * as ActionTypes from './actionTypes';
import API from '../../services/api';

export const setToken = token => dispatch => {
    dispatch({
        type: ActionTypes.SET_TOKEN,
        payload: token
    });
};

export const login = (username, password) => async dispatch => {
    return API.adminLogin(username, password).then(token => {
        console.log('TOKEN', token);
        dispatch(setToken(token));
    });
};
