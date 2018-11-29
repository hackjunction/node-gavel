import _ from 'lodash';
import * as ActionTypes from './actionTypes';

const initialState = {
	events: [],
	eventsLoading: false,
	eventsError: false,
	projects: {}
};

export default function reducer(state = initialState, action) {
	switch (action.type) {
		case 'persist/REHYDRATE': {
			return {
				...initialState,
				...state,
			}
		}
		case ActionTypes.SET_EVENTS: {
			return {
				...state,
				events: action.payload,
				eventsLoading: false,
			}
		}
		case ActionTypes.SET_EVENTS_LOADING: {
			return {
				...state,
				eventsLoading: true,
				eventsError: false,
			}
		}
		case ActionTypes.SET_EVENTS_ERROR: {
			return {
				...state,
				eventsError: true,
				eventsLoading: false,
			}
		}
		case ActionTypes.SET_PROJECTS_FOR_EVENT: {
			const { eventId, projects } = action.payload;

			if (state.projects.hasOwnProperty(eventId)) {
				return {
					...state,
					projects: {
						...state.projects,
						[eventId]: {
							...state.projects[eventId],
							data: projects,
							error: false,
							loading: false,
						}
					}
				}
			} else {
				return {
					...state,
					projects: {
						...state.projects,
						[eventId]: {
							data: projects,
							error: false,
							loading: false,
						}
					}
				}
			}
		}
		case ActionTypes.SET_PROJECTS_FOR_EVENT_LOADING: {
			const { eventId } = action.payload;

			if (state.projects.hasOwnProperty(eventId)) {
				return {
					...state,
					projects: {
						...state.projects,
						[eventId]: {
							...state.projects[eventId],
							error: false,
							loading: true,
						}
					}
				}
			} else {
				return {
					...state,
					projects: {
						...state.projects,
						[eventId]: {
							data: [],
							error: false,
							loading: true,
						}
					}
				}
			}
		}
		case ActionTypes.SET_PROJECTS_FOR_EVENT_ERROR: {
			const { eventId } = action.payload;

			if (state.projects.hasOwnProperty(eventId)) {
				return {
					...state,
					projects: {
						...state.projects,
						[eventId]: {
							...state.projects[eventId],
							error: true,
							loading: false,
						}
					}
				}
			} else {
				return {
					...state,
					projects: {
						...state.projects,
						[eventId]: {
							data: [],
							error: true,
							loading: false,
						}
					}
				}
			}
		}
		default: return state;
	}
}