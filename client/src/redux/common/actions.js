import * as ActionTypes from './actionTypes';
import API from '../../services/api';

export const setEvents = (events) => dispatch => {
	dispatch({
		type: ActionTypes.SET_EVENTS,
		payload: events
	});
}

export const setEventsLoading = () => dispatch => {
	dispatch({
		type: ActionTypes.SET_EVENTS_LOADING
	});
}

export const setEventsError = () => dispatch => {
	dispatch({
		type: ActionTypes.SET_EVENTS_ERROR
	});
}

export const fetchEvents = () => dispatch => {
	dispatch(setEventsLoading());
	return API.getEventsPublic().then(events => {
		dispatch(setEvents(events));
		return events;
	}).catch(error => {
		dispatch(setEventsError());
		return Promise.reject(error);
	});
}

export const setProjectsForEvent = (eventId, projects) => dispatch => {
	dispatch({
		type: ActionTypes.SET_PROJECTS_FOR_EVENT,
		payload: {
			eventId,
			projects
		}
	});
}

export const setProjectsForEventLoading = (eventId) => dispatch => {
	dispatch({
		type: ActionTypes.SET_PROJECTS_FOR_EVENT_LOADING,
		payload: {
			eventId
		}
	});
}

export const setProjectsForEventError = (eventId) => dispatch => {
	dispatch({
		type: ActionTypes.SET_PROJECTS_FOR_EVENT_ERROR,
		payload: {
			eventId
		}
	});
}

export const fetchProjectsForEvent = (eventId) => dispatch => {
	dispatch(setProjectsForEventLoading(eventId));
	return API.getProjectsForEventPublic(eventId).then(projects => {
		dispatch(setProjectsForEvent(eventId, projects));
		return projects;
	}).catch(error => {
		dispatch(setProjectsForEventError(eventId));
		return Promise.reject(error);
	})
} 