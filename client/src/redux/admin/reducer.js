import _ from 'lodash';
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
        case ActionTypes.SET_EVENT: {
            const event = action.payload;
            const eventIdx = _.findIndex(state.events, e => e._id === event._id);

            if (eventIdx !== -1) {
                return {
                    ...state,
                    events: _.map(state.events, (e, idx) => {
                        if (idx === eventIdx) {
                            return event;
                        } else {
                            return e;
                        }
                    })
                };
            } else {
                return {
                    ...state,
                    events: _.concat(state.events, event)
                };
            }
        }
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
            const eventId = action.payload;

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
            const eventId = action.payload;

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
        case ActionTypes.SET_PROJECTS_FOR_EVENT: {
            const eventId = action.payload.eventId;

            if (state.projects.hasOwnProperty(eventId)) {
                return {
                    ...state,
                    projects: {
                        ...state.projects,
                        [eventId]: {
                            ...state.projects[eventId],
                            data: action.payload.projects,
                            loading: false,
                            error: false
                        }
                    }
                };
            } else {
                return {
                    ...state,
                    projects: {
                        ...state.projects,
                        [eventId]: {
                            data: action.payload.projects,
                            loading: false,
                            error: false
                        }
                    }
                };
            }
        }
        case ActionTypes.SET_PROJECTS_LOADING_FOR_EVENT: {
            const eventId = action.payload;

            if (state.projects.hasOwnProperty(eventId)) {
                return {
                    ...state,
                    projects: {
                        ...state.projects,
                        [eventId]: {
                            ...state.projects[eventId],
                            loading: true,
                            error: false
                        }
                    }
                };
            } else {
                return {
                    ...state,
                    projects: {
                        ...state.projects,
                        [eventId]: {
                            ...state.projects[eventId],
                            loading: true,
                            error: false
                        }
                    }
                };
            }
        }
        case ActionTypes.SET_PROJECTS_ERROR_FOR_EVENT: {
            const eventId = action.payload;

            if (state.projects.hasOwnProperty(eventId)) {
                return {
                    ...state,
                    projects: {
                        ...state.projects,
                        [eventId]: {
                            ...state.projects[eventId],
                            loading: false,
                            error: true
                        }
                    }
                };
            } else {
                return {
                    ...state,
                    projects: {
                        ...state.projects,
                        [eventId]: {
                            data: [],
                            loading: false,
                            error: true
                        }
                    }
                };
            }
        }
        case ActionTypes.UPDATE_PROJECT_FOR_EVENT: {
            const { project, eventId } = action.payload;

            if (state.projects.hasOwnProperty(eventId)) {
                return {
                    ...state,
                    projects: {
                        ...state.projects,
                        [eventId]: {
                            ...state.projects[eventId],
                            data: _.map(state.projects[eventId].data, p => {
                                if (p._id === project._id) {
                                    return project;
                                }
                                return p;
                            })
                        }
                    }
                };
            }

            //If state does not have projects for this event, doesn't make sense to update...
            return state;
        }
        case ActionTypes.UPDATE_ANNOTATOR_FOR_EVENT: {
            const { annotator, eventId } = action.payload;

            if (state.annotators.hasOwnProperty(eventId)) {
                return {
                    ...state,
                    annotators: {
                        ...state.annotators,
                        [eventId]: {
                            ...state.annotators[eventId],
                            data: _.map(state.annotators[eventId].data, a => {
                                if (a._id === annotator._id) {
                                    return annotator;
                                }
                                return a;
                            })
                        }
                    }
                };
            }

            //If state does not have annotators for this event, doesn't make sense to update...
            return state;
        }
        default:
            return state;
    }
}
