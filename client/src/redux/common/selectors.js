export const getEvents = state => state.common.events || [];
export const isEventsLoading = state => state.common.eventsLoading || false;
export const isEventsError = state => state.common.eventsError || false;

export const getProjectsForEvent = state => (eventId) => {
	if (state.common.projects && state.common.projects.hasOwnProperty(eventId)) {
		return state.common.projects[eventId].data;
	} else {
		return [];
	}
}

export const isProjectsForEventLoading = state => (eventId) => {
	if (state.common.projects && state.common.projects.hasOwnProperty(eventId)) {
		return state.common.projects[eventId].loading;
	} else {
		return true;
	}
}

export const isProjectsForEventError = state => (eventId) => {
	if (state.common.projects && state.common.projects.hasOwnProperty(eventId)) {
		return state.common.projects[eventId].error;
	} else {
		return false;
	}
}