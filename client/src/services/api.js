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
                console.log(response);
                let body = await response.json();
                reject(new Error(body.message));
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
                let body = await response.json();
                reject(new Error(body.message));
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
                let body = await response.json();
                reject(new Error(body.message));
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
                let body = await response.json();
                reject(new Error(body.message));
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
    adminLogin: (username, password) => {
        return POST(`/api/login`, { username, password });
    },

    adminCreateEvent: (event, token) => {
        return POST('/api/event', { event, token });
    }
};

export default API;
