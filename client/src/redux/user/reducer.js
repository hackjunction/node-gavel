import * as ActionTypes from './actionTypes';

const initialState = {
    user: null,
    userLoading: false
};

export default function reducer(state = initialState, action) {
    switch (action.type) {
        case ActionTypes.SET_USER:
            return {
                ...state,
                user: action.payload,
                userLoading: false
            };
        case ActionTypes.SET_USER_LOADING:
            return {
                ...state,
                userLoading: true
            };
        default:
            return state;
    }
}
