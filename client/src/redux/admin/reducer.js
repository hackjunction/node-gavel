import * as ActionTypes from './actionTypes';

const initialState = {
    token: null,
    tokenVerified: new Date(0),
    events: [],
    annotators: {},
    projects: {}
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
        case ActionTypes.SET_ANNOTATORS_FOR_EVENT:
            return {
                ...state,
                annotators: {
                    ...state.annotators,
                    [action.payload.eventId]: {
                        data: action.payload.annotators,
                        loading: false
                    }
                }
            };
        case ActionTypes.SET_ANNOTATORS_LOADING_FOR_EVENT:
            return {
                ...state,
                annotators: {
                    ...state.annotators,
                    [action.payload.eventId]: {
                        ...state.annotators[action.payload.eventId],
                        loading: true,
                        error: false
                    }
                }
            };
        case ActionTypes.SET_ANNOTATORS_ERROR_FOR_EVENT:
            return {
                ...state,
                annotators: {
                    ...state.annotators,
                    [action.payload.eventId]: {
                        ...state.annotators[action.payload.eventId],
                        error: true,
                        loading: false
                    }
                }
            };
        default:
            return state;
    }
}
