import * as ActionTypes from './actionTypes';

const initialState = {
    token: null,
    tokenVerified: new Date(0),
    events: []
};

export default function reducer(state = initialState, action) {
    switch (action.type) {
        case ActionTypes.SET_TOKEN:
            return {
                ...state,
                token: action.payload,
                tokenVerified: Date.now()
            };
        case ActionTypes.SET_EVENTS:
            return {
                ...state,
                events: action.payload
            };
        default:
            return state;
    }
}
