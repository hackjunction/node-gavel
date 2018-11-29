import Promise from 'bluebird';

const SUCCESS = 200;

const POST = (url, data) => {
    return new Promise(async function (resolve, reject) {
        try {
            let response = await fetch(url, {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            if (response.status !== SUCCESS) {
                let body = await response.json();
                reject(new Error(body.message || 'Request failed with status ' + response.status));
            } else {
                let body = await response.json();
                resolve(body.data);
            }
        } catch (error) {
            console.log('POST ERROR at ' + url, error);
            reject(error);
        }
    });
};

const PATCH = (url, data) => {
    return new Promise(async function (resolve, reject) {
        try {
            let response = await fetch(url, {
                method: 'PATCH',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            if (response.status !== SUCCESS) {
                let body = await response.json();
                reject(new Error(body.message || 'Request failed with status ' + response.status));
            } else {
                let body = await response.json();
                resolve(body.data);
            }
        } catch (error) {
            console.log('PATCH ERROR at ' + url, error);
            reject(error);
        }
    });
};

const GET = url => {
    return new Promise(async function (resolve, reject) {
        try {
            let response = await fetch(url);

            if (response.status !== SUCCESS) {
                console.log('RESPONSE', response);
                let body = await response.json();
                reject(new Error(body.message || 'Request failed with status ' + response.status));
            } else {
                let body = await response.json();
                resolve(body.data);
            }
        } catch (error) {
            console.log('GET ERROR at ' + url, error);
            reject(error);
        }
    });
};

const DELETE = url => {
    return new Promise(async function (resolve, reject) {
        try {
            let response = await fetch(url, { method: 'DELETE' });

            if (response.status !== SUCCESS) {
                let body = await response.json();
                reject(new Error(body.message || 'Request failed with status ' + response.status));
            } else {
                let body = await response.json();
                resolve(body.data);
            }
        } catch (error) {
            console.log('DELETE ERROR at ' + url, error);
            reject(error);
        }
    });
};

const API = {
    /* Requires admin token */

    adminLogin: (username, password) => {
        return POST(`/api/login`, { username, password });
    },

    adminCreateEvent: (event, token) => {
        return POST('/api/events', { event, token });
    },

    adminGetEvents: token => {
        return GET(`/api/events/?token=${token}`);
    },

    adminGetEvent: (token, eventId) => {
        return GET(`/api/events/${eventId}/?token=${token}`);
    },

    adminGetChallengesForEvent: (token, eventId) => {
        return GET(`/api/events/${eventId}/challenges/?token=${token}`);
    },

    adminGetChallengeWinnersForEvent: (token, eventId) => {
        return GET(`/api/events/${eventId}/winners/?token=${token}`);
    },

    adminGetProjectsForEvent: (token, eventId) => {
        return GET(`/api/projects/event/${eventId}/?token=${token}`);
    },

    adminGetAnnotatorsForEvent: (token, eventId) => {
        return GET(`/api/annotators/event/${eventId}/?token=${token}`);
    },

    adminPrioritizeProject: (token, projectId) => {
        return GET(`/api/projects/prioritize/${projectId}/?token=${token}`);
    },

    adminDeprioritizeProject: (token, projectId) => {
        return GET(`/api/projects/deprioritize/${projectId}/?token=${token}`);
    },

    adminDisableProject: (token, projectId) => {
        return GET(`/api/projects/disable/${projectId}/?token=${token}`);
    },

    adminEnableProject: (token, projectId) => {
        return GET(`/api/projects/enable/${projectId}/?token=${token}`);
    },

    adminGetProject: (token, projectId) => {
        return GET(`/api/projects/${projectId}/?token=${token}`);
    },

    adminEditProject: (token, projectId, data) => {
        return POST(`/api/projects/edit/${projectId}`, { data, token });
    },

    adminDisableAnnotator: (token, annotatorId) => {
        return GET(`/api/annotators/disable/${annotatorId}/?token=${token}`);
    },

    adminEnableAnnotator: (token, annotatorId) => {
        return GET(`/api/annotators/enable/${annotatorId}/?token=${token}`);
    },

    adminCreateAnnotator: (token, name, email, eventId) => {
        return POST(`/api/annotators/`, { token, name, email, eventId });
    },

    adminExtendSubmissionDeadline: (token, eventId) => {
        return GET(`/api/events/extend/${eventId}/?token=${token}`);
    },

    adminToggleTrackWinnersPublic: (token, eventId, isPublic) => {
        return GET(`/api/events/track-winners-public/${eventId}/?token=${token}&public=${isPublic}`);
    },

    adminToggleFinalistVotingOpen: (token, eventId, isOpen) => {
        return GET(`/api/events/finalist-voting-open/${eventId}/?token=${token}&open=${isOpen}`);
    },

    /* Public routes */

    getEventWithCode: code => {
        return GET(`/api/events/code/${code}`);
    },

    createTeam: (eventId, teamMembers, contactPhone) => {
        return POST('/api/teams/', { eventId, teamMembers, contactPhone });
    },

    getProjectById: projectId => {
        return GET('/api/projects/public/' + projectId);
    },

    getProjectsForEventPublic: eventId => {
        return GET(`/api/projects/event/public/${eventId}`);
    },

    getEventsPublic: () => {
        return GET('/api/events/public');
    },

    /* Requires annotator secret */

    updateSubmission: (project, secret) => {
        const params = { project, secret };

        return POST('/api/projects', params);
    },

    getUser: secret => {
        return GET(`/api/annotators/?secret=${secret}`);
    },

    getUserEvent: secret => {
        return GET(`/api/annotators/event/?secret=${secret}`);
    },

    getTeamMembers: secret => {
        return GET(`/api/teams/members/?secret=${secret}`);
    },

    addTeamMember: (name, email, secret) => {
        const params = {
            name,
            email,
            secret
        };

        return POST(`/api/teams/members`, params);
    },

    removeTeamMember: (_id, secret) => {
        return DELETE(`/api/teams/members/?secret=${secret}&_id=${_id}`);
    },

    getSubmission: secret => {
        return GET(`/api/teams/submission/?secret=${secret}`);
    },

    initAnnotator: secret => {
        return GET(`/api/annotators/init/?secret=${secret}`);
    },

    setAnnotatorOnboarded: secret => {
        return GET(`/api/annotators/onboarded/?secret=${secret}`);
    },

    getNextDecision: secret => {
        return GET(`/api/annotators/decision/?secret=${secret}`);
    },

    submitVote: (secret, choice) => {
        return GET(`/api/annotators/vote/${choice}/?secret=${secret}`);
    },

    getProjectsByChallenge: (eventId, secret) => {
        return GET(`/api/projects/challenge/${eventId}/${secret}`);
    },

    setChallengeWinners: (eventId, secret, data) => {
        return POST(`/api/projects/challenge/winners/${eventId}/${secret}`, { data });
    },

    getChallengeWinners: (eventId, secret) => {
        return GET(`/api/projects/challenge/winners/${eventId}/${secret}`);
    },

    getTrackWinners: (secret, eventId) => {
        return GET(`/api/events/track-winners/${eventId}/?secret=${secret}`);
    },

    updateWinnerVote: (secret, projectId) => {
        return GET(`/api/annotators/set-finalist-vote/${projectId}/?secret=${secret}`);
    },
};

export default API;
