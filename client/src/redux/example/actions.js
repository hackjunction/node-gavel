import * as ActionTypes from './actionTypes';

export const exampleAction = (param1, param2) => dispatch => {
    dispatch({
        type: ActionTypes.MY_ACTION,
        payload: {
            param1,
            param2
        }
    });
};
