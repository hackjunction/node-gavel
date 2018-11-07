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
        case ActionTypes.SET_ANNOTATORS_FOR_EVENT: {
            const eventId = action.payload.eventId;

            if (state.annotators.hasOwnProperty(eventId)) {
                return {
                    ...state,
                    annotators: {
                        ...state.annotators,
                        [eventId]: {
                            ...state.annotators[eventId],
                            data: action.payload.annotators,
                            loading: false,
                            error: false
                        }
                    }
                };
            } else {
                return {
                    ...state,
                    annotators: {
                        ...state.annotators,
                        [eventId]: {
                            data: action.payload.annotators,
                            loading: false,
                            error: false
                        }
                    }
                };
            }
        }
        case ActionTypes.SET_ANNOTATORS_LOADING_FOR_EVENT: {
            const eventId = action.payload.eventId;

            if (state.annotators.hasOwnProperty(eventId)) {
                return {
                    ...state,
                    annotators: {
                        ...state.annotators,
                        [eventId]: {
                            ...state.annotators[eventId],
                            loading: true,
                            error: false
                        }
                    }
                };
            } else {
                return {
                    ...state,
                    annotators: {
                        ...state.annotators,
                        [eventId]: {
                            ...state.annotators[eventId],
                            loading: true,
                            error: false
                        }
                    }
                };
            }
        }
        case ActionTypes.SET_ANNOTATORS_ERROR_FOR_EVENT: {
            const eventId = action.payload.eventId;

            if (state.annotators.hasOwnProperty(eventId)) {
                return {
                    ...state,
                    annotators: {
                        ...state.annotators,
                        [eventId]: {
                            ...state.annotators[eventId],
                            loading: false,
                            error: true
                        }
                    }
                };
            } else {
                return {
                    ...state,
                    annotators: {
                        ...state.annotators,
                        [eventId]: {
                            data: [],
                            loading: false,
                            error: true
                        }
                    }
                };
            }
        }
        default:
            return state;
    }
}
