const ProjectController = require('../controllers/Project');
const status = require('http-status');
const passport = require('passport');
const ChallengeWinnersController = require('../controllers/ChallengeWinners');
const EventController = require('../controllers/Event');
const Utils = require('../services/utils');

module.exports = function (app) {
    /**
     * Get all projects for an event
     * -> Requires admin token
     */
    app.get('/api/projects/event/:eventId', passport.authenticate('admin', { session: false }), getProjectsForEvent);

    /**
     * Get a project by id
     * -> Requires admin token
     */
    app.get('/api/projects/:projectId', passport.authenticate('admin', { session: false }), getProjectById);

    /**
     * Get a project by id (only public details)
     * -> No auth required
     */
    app.get('/api/projects/public/:projectId', getProjectByIdPublic);

    /**
     * Get all projects with a given challenge (by challenge secret)
     *  -> Requires challenge secret
     */
    app.get('/api/projects/challenge/:eventId/:secret', getProjectsByChallenge);


    /**
     * Set or update challenge winners for a specific challenge
     * -> Requires challenge secret
     */
    app.post(
        '/api/projects/challenge/winners/:eventId/:secret',
        updateChallengeWinners
    );

    /**
     * Get winners of a given challenge
     *  -> Requires challenge secret
     */
    app.get(
        '/api/projects/challenge/winners/:eventId/:secret',
        getChallengeWinners
    );

    /**
     * Set a project as prioritized
     * -> Requires admin token
     */
    app.get(
        '/api/projects/prioritize/:projectId',
        passport.authenticate('admin', { session: false }),
        prioritizeProject
    );

    /**
     * Set a project as unprioritized (default)
     * -> Requires admin token
     */
    app.get(
        '/api/projects/deprioritize/:projectId',
        passport.authenticate('admin', { session: false }),
        deprioritizeProject
    );

    /**
     * Set a project as enabled (default)
     * -> Requires admin token
     */
    app.get('/api/projects/enable/:projectId', passport.authenticate('admin', { session: false }), enableProject);

    /**
     * Set a project as disabled
     * -> Requires admin token
     */
    app.get('/api/projects/disable/:projectId', passport.authenticate('admin', { session: false }), disableProject);

    app.post('/api/projects/edit/:projectId', passport.authenticate('admin', { session: false }), editProject);

    /**
     * Create or update a project
     * -> Requires annotator secret
     */
    app.post('/api/projects', passport.authenticate('annotator', { session: false }), updateProject);
};

function updateProject(req, res) {
    ProjectController.update(req.body.project, req.user)
        .then(data => {
            return res.status(status.OK).send({
                status: 'success',
                data
            });
        })
        .catch(error => {
            console.log('ProjectController.create', error);
            return res.status(status.INTERNAL_SERVER_ERROR).send({
                status: 'error'
            });
        });
}

function editProject(req, res) {
    ProjectController.edit(req.body.data, req.params.projectId)
        .then(project => {
            return res.status(status.OK).send({
                status: 'success',
                data: project
            });
        })
        .catch(error => {
            console.log('editProject', error);
            return res.status(status.INTERNAL_SERVER_ERROR).send({
                status: 'error'
            });
        });
}

function getProjectsForEvent(req, res) {
    ProjectController.getByEvent(req.params.eventId)
        .then(projects => {
            return res.status(status.OK).send({
                status: 'success',
                data: projects
            });
        })
        .catch(error => {
            console.log('getProjectsForEvent', error);
            return res.status(status.INTERNAL_SERVER_ERROR).send({
                status: 'error'
            });
        });
}

function getProjectsByChallenge(req, res) {
    const { secret, eventId } = req.params;
    const challengeId = Utils.decrypt(secret);

    ProjectController.getByChallenge(challengeId, eventId)
        .then(projects => {
            EventController.getEventWithIdPublic(eventId).then(event => {
                return res.status(status.OK).send({
                    status: 'success',
                    data: {
                        projects,
                        event,
                        challengeId
                    }
                });
            })
        })
        .catch(error => {
            console.log('getProjectsByChallenge', error);
            return res.status(status.INTERNAL_SERVER_ERROR).send({
                status: 'error'
            });
        });
}

function getProjectById(req, res) {
    ProjectController.getById(req.params.projectId)
        .then(project => {
            return res.status(status.OK).send({
                status: 'success',
                data: project
            });
        })
        .catch(error => {
            console.log('getProjectById', error);
            return res.status(status.INTERNAL_SERVER_ERROR).send({
                status: 'error'
            });
        });
}

function getProjectByIdPublic(req, res) {
    ProjectController.getByIdPublic(req.params.projectId)
        .then(project => {
            return res.status(status.OK).send({
                status: 'success',
                data: project
            });
        })
        .catch(error => {
            console.log('getProjectByIdPublic', error);
            return res.status(status.INTERNAL_SERVER_ERROR).send({
                status: 'error'
            });
        });
}

function prioritizeProject(req, res) {
    ProjectController.prioritize(req.params.projectId)
        .then(project => {
            return res.status(status.OK).send({
                status: 'success',
                data: project
            });
        })
        .catch(error => {
            console.log('prioritizeProject', error);
            return res.status(status.INTERNAL_SERVER_ERROR).send({
                status: 'error'
            });
        });
}

function deprioritizeProject(req, res) {
    ProjectController.deprioritize(req.params.projectId)
        .then(project => {
            return res.status(status.OK).send({
                status: 'success',
                data: project
            });
        })
        .catch(error => {
            console.log('deprioritizeProject', error);
            return res.status(status.INTERNAL_SERVER_ERROR).send({
                status: 'error'
            });
        });
}

function enableProject(req, res) {
    ProjectController.enable(req.params.projectId)
        .then(project => {
            return res.status(status.OK).send({
                status: 'success',
                data: project
            });
        })
        .catch(error => {
            console.log('enableProject', error);
            return res.status(status.INTERNAL_SERVER_ERROR).send({
                status: 'error'
            });
        });
}

function disableProject(req, res) {
    ProjectController.disable(req.params.projectId)
        .then(project => {
            return res.status(status.OK).send({
                status: 'success',
                data: project
            });
        })
        .catch(error => {
            console.log('disableProject', error);
            return res.status(status.INTERNAL_SERVER_ERROR).send({
                status: 'error'
            });
        });
}


function updateChallengeWinners(req, res) {
    const { secret, eventId } = req.params;
    const { data } = req.body;
    const challengeId = Utils.decrypt(secret);

    ChallengeWinnersController.createOrUpdate(challengeId, eventId, data).then(winners => {
        return res.status(status.OK).send({
            status: 'success',
            data: winners
        });
    }).catch(error => {
        console.log('updateChallengeWinners', error);
        return res.status(status.INTERNAL_SERVER_ERROR).send({
            status: 'error'
        });
    });
}

function getChallengeWinners(req, res) {
    const { secret, eventId } = req.params;
    const { data } = req.body;
    const challengeId = Utils.decrypt(secret);

    ChallengeWinnersController.getByChallenge(challengeId).then(winners => {
        return res.status(status.OK).send({
            status: 'success',
            data: winners
        });
    }).catch(error => {
        console.log('getChallengeWinners', error);
        return res.status(status.INTERNAL_SERVER_ERROR).send({
            status: 'error'
        });
    });
}