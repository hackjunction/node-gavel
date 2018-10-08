import * as ActionTypes from './actionTypes';

const initialState = {
    token: null,
    tokenVerified: new Date(0)
};

export default function reducer(state = initialState, action) {
    switch (action.type) {
        case ActionTypes.SET_TOKEN:
            return {
                ...state,
                token: action.payload,
                tokenVerified: Date.now()
            };
        default:
            return state;
    }
}
