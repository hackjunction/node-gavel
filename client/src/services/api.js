import Promise from 'bluebird';

const SUCCESS = 200;

const POST = (url, data) => {
    return new Promise(async function(resolve, reject) {
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
                reject(new Error('Request failed with response', response));
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
    return new Promise(async function(resolve, reject) {
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
                reject(new Error('Request failed with response', response));
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
    return new Promise(async function(resolve, reject) {
        try {
            let response = await fetch(url);

            if (response.status !== SUCCESS) {
                reject(new Error('Request failed with response', response));
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
    return new Promise(async function(resolve, reject) {
        try {
            let response = await fetch(url, { method: 'DELETE' });

            if (response.status !== SUCCESS) {
                reject(new Error('Request failed with response', response));
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

    /* Public routes */

    getEventWithCode: code => {
        return GET(`/api/events/code/${code}`);
    },

    createTeam: (eventId, teamMembers, contactPhone) => {
        return POST('/api/teams/', { eventId, teamMembers, contactPhone });
    },

    /* Requires annotator secret */

    updateSubmission: (project, secret) => {
        const params = { project, secret };

        console.log('POST updateSubmission', params);
        return POST('/api/projects', params);
    },

    getUser: secret => {
        return GET(`/api/annotators/?secret=${secret}`);
    },

    getTeamMembers: secret => {
        return GET(`/api/teams/members/?secret=${secret}`);
    },

    getSubmission: secret => {
        return GET(`/api/teams/submission/?secret=${secret}`);
    }
};

export default API;
