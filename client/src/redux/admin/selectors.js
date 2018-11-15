import _ from 'lodash';

export const isLoggedIn = state => state.admin.token !== null;
export const getToken = state => state.admin.token;
export const getEvents = state => (state.admin.events ? state.admin.events : []);

export const getEvent = state => eventId => {
    if (state.admin.events) {
        return _.find(state.admin.events, event => {
            return event._id === eventId;
        });
    }
    return null;
};

export const getAnnotators = state => eventId => {
    if (state.admin.annotators && state.admin.annotators.hasOwnProperty(eventId)) {
        return state.admin.annotators[eventId].data;
    }
    return [];
};

export const getAnnotatorsLoading = state => eventId => {
    if (state.admin.annotators && state.admin.annotators.hasOwnProperty(eventId)) {
        return state.admin.annotators[eventId].loading;
    }
    return false;
};

export const getAnnotatorsError = state => eventId => {
    if (state.admin.annotators && state.admin.annotators.hasOwnProperty(eventId)) {
        return state.admin.annotators[eventId].error;
    }
    return false;
};

export const getProjects = state => eventId => {
    if (state.admin.projects && state.admin.projects.hasOwnProperty(eventId)) {
        return state.admin.projects[eventId].data;
    }
    return [];
};

export const getProjectsLoading = state => eventId => {
    if (state.admin.projects && state.admin.projects.hasOwnProperty(eventId)) {
        return state.admin.projects[eventId].loading;
    }
    return false;
};

export const getProjectsError = state => eventId => {
    if (state.admin.projects && state.admin.projects.hasOwnProperty(eventId)) {
        return state.admin.projects[eventId].error;
    }
    return false;
};
