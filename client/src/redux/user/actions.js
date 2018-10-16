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
    dispatch({
        type: ActionTypes.SET_USER_ERROR
    })
};

export const fetchUser = secret => dispatch => {
    console.log('GETTING USER WITH SECRET', secret);
    dispatch(setUserLoading());
    return API.getUser(secret)
        .then(user => {
            console.log('GOT USER', user);
            dispatch(setUser(user));
        })
        .catch(error => {
            console.log('ERROR', error);
            dispatch(setUserError());
        });
};
