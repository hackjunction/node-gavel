import * as ActionTypes from './actionTypes';
import API from '../../services/api';
import Utils from '../../services/utils';

export const setToken = token => dispatch => {
    dispatch({
        type: ActionTypes.SET_TOKEN,
        payload: token
    });
};

export const setEvent = event => dispatch => {
    dispatch({
        type: ActionTypes.SET_EVENT,
        payload: event
    });
};

export const setEvents = events => dispatch => {
    dispatch({
        type: ActionTypes.SET_EVENTS,
        payload: events
    });
};

export const login = (username, password) => dispatch => {
    return API.adminLogin(username, password).then(token => {
        dispatch(setToken(token));
    });
};

export const fetchEvents = token => dispatch => {
    return API.adminGetEvents(token).then(events => {
        dispatch(setEvents(events));
    });
};

export const fetchEvent = (token, eventId) => dispatch => {
    return API.adminGetEvent(token, eventId).then(event => {
        dispatch(setEvent(event));
    });
};

export const setAnnotatorsForEvent = (eventId, annotators) => dispatch => {
    dispatch({
        type: ActionTypes.SET_ANNOTATORS_FOR_EVENT,
        payload: {
            eventId,
            annotators
        }
    });
};

export const setAnnotatorsLoadingForEvent = eventId => dispatch => {
    dispatch({
        type: ActionTypes.SET_ANNOTATORS_LOADING_FOR_EVENT,
        payload: eventId
    });
};

export const setAnnotatorsErrorForEvent = eventId => dispatch => {
    dispatch({
        type: ActionTypes.SET_ANNOTATORS_ERROR_FOR_EVENT,
        payload: eventId
    });
};

export const fetchAnnotatorsForEvent = (token, eventId, minDelay = 0) => async dispatch => {
    dispatch(setAnnotatorsLoadingForEvent(eventId));
    return Utils.minDelay(API.adminGetAnnotatorsForEvent(token, eventId), minDelay)
        .then(annotators => {
            dispatch(setAnnotatorsForEvent(eventId, annotators));
        })
        .catch(error => {
            console.log('fetchAnnotatorsForEvent', error);
            dispatch(setAnnotatorsErrorForEvent(eventId));
        });
};

export const setProjectsForEvent = (eventId, projects) => dispatch => {
    dispatch({
        type: ActionTypes.SET_PROJECTS_FOR_EVENT,
        payload: {
            eventId,
            projects
        }
    });
};

export const setProjectsLoadingForEvent = eventId => dispatch => {
    dispatch({
        type: ActionTypes.SET_PROJECTS_LOADING_FOR_EVENT,
        payload: eventId
    });
};

export const setProjectsErrorForEvent = eventId => dispatch => {
    dispatch({
        type: ActionTypes.SET_PROJECTS_ERROR_FOR_EVENT,
        payload: eventId
    });
};

export const fetchProjectsForEvent = (token, eventId, minDelay = 0) => dispatch => {
    dispatch(setProjectsLoadingForEvent(eventId));
    return Utils.minDelay(API.adminGetProjectsForEvent(token, eventId), minDelay)
        .then(projects => {
            dispatch(setProjectsForEvent(eventId, projects));
        })
        .catch(error => {
            console.log('fetchProjectsForEvent', error);
            dispatch(setProjectsErrorForEvent(eventId));
        });
};

export const enableAnnotator = (token, annotator, eventId) => dispatch => {
    dispatch({
        type: ActionTypes.UPDATE_ANNOTATOR_FOR_EVENT,
        payload: {
            annotator: {
                ...annotator,
                active: true
            },
            eventId
        }
    });
    return API.adminEnableAnnotator(token, annotator._id).then(result => {
        dispatch({
            type: ActionTypes.UPDATE_ANNOTATOR_FOR_EVENT,
            payload: {
                annotator: result,
                eventId
            }
        });
    });
};

export const disableAnnotator = (token, annotator, eventId) => dispatch => {
    dispatch({
        type: ActionTypes.UPDATE_ANNOTATOR_FOR_EVENT,
        payload: {
            annotator: {
                ...annotator,
                active: false
            },
            eventId
        }
    });
    return API.adminDisableAnnotator(token, annotator._id).then(result => {
        dispatch({
            type: ActionTypes.UPDATE_ANNOTATOR_FOR_EVENT,
            payload: {
                annotator: result,
                eventId
            }
        });
    });
};

export const enableProject = (token, project, eventId) => dispatch => {
    dispatch({
        type: ActionTypes.UPDATE_PROJECT_FOR_EVENT,
        payload: {
            project: {
                ...project,
                active: true
            },
            eventId
        }
    });
    return API.adminEnableProject(token, project._id).then(result => {
        dispatch({
            type: ActionTypes.UPDATE_PROJECT_FOR_EVENT,
            payload: {
                project: result,
                eventId
            }
        });
    });
};

export const disableProject = (token, project, eventId) => dispatch => {
    dispatch({
        type: ActionTypes.UPDATE_PROJECT_FOR_EVENT,
        payload: {
            project: {
                ...project,
                active: false
            },
            eventId
        }
    });
    return API.adminDisableProject(token, project._id).then(result => {
        dispatch({
            type: ActionTypes.UPDATE_PROJECT_FOR_EVENT,
            payload: {
                project: result,
                eventId
            }
        });
    });
};

export const prioritiseProject = (token, project, eventId) => dispatch => {
    dispatch({
        type: ActionTypes.UPDATE_PROJECT_FOR_EVENT,
        payload: {
            project: {
                ...project,
                prioritized: true
            },
            eventId
        }
    });
    return API.adminPrioritizeProject(token, project._id).then(result => {
        dispatch({
            type: ActionTypes.UPDATE_PROJECT_FOR_EVENT,
            payload: {
                project: result,
                eventId
            }
        });
    });
};

export const deprioritiseProject = (token, project, eventId) => dispatch => {
    dispatch({
        type: ActionTypes.UPDATE_PROJECT_FOR_EVENT,
        payload: {
            project: {
                ...project,
                prioritized: false
            },
            eventId
        }
    });
    return API.adminDeprioritizeProject(token, project._id).then(result => {
        dispatch({
            type: ActionTypes.UPDATE_PROJECT_FOR_EVENT,
            payload: {
                project: result,
                eventId
            }
        });
    });
};

export const extendSubmissionDeadline = (token, eventId) => dispatch => {
    return API.adminExtendSubmissionDeadline(token, eventId).then(event => {
        dispatch({
            type: ActionTypes.SET_EVENT,
            payload: event
        });

        return event;
    });
};

export const toggleTrackWinnersPublic = (token, eventId, isPublic) => dispatch => {
    return API.adminToggleTrackWinnersPublic(token, eventId, isPublic).then(event => {
        dispatch({
            type: ActionTypes.SET_EVENT,
            payload: event,
        });

        return event;
    })
}

export const toggleFinalistVotingOpen = (token, eventId, isOpen) => dispatch => {
    return API.adminToggleFinalistVotingOpen(token, eventId, isOpen).then(event => {
        dispatch({
            type: ActionTypes.SET_EVENT,
            payload: event,
        });

        return event;
    })
}