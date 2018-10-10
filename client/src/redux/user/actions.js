import * as ActionTypes from './actionTypes';
import API from '../../services/api';

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
    dispatch(setUser(null));
};

export const fetchUser = secret => dispatch => {
    dispatch(setUserLoading());
    return API.getUser(secret)
        .then(user => {
            dispatch(setUser(user));
        })
        .catch(error => {
            dispatch(setUserError());
        });
};
