// 'use strict';
const status = require('http-status');
const passport = require('passport');
const TeamController = require('../controllers/Team');
const AnnotatorController = require('../controllers/Annotator');
const ProjectController = require('../controllers/Project');

module.exports = function (app) {
    /* Requires admin token */
    app.get('/api/teams', passport.authenticate('admin', { session: false }), getTeams);

    /* Requires annotator token */
    app.delete('/api/teams/members/', passport.authenticate('annotator', { session: false }), removeTeamMember);
    app.post('/api/teams/members', passport.authenticate('annotator', { session: false }), addTeamMember);
    app.get('/api/teams/members', passport.authenticate('annotator', { session: false }), getTeamMembers);
    app.get('/api/teams/submission', passport.authenticate('annotator', { session: false }), getTeamSubmission);

    /* Public routes */
    app.post('/api/teams', createTeam);
};

function getTeams(req, res) {
    TeamController.getAll()
        .then(data => {
            return res.status(status.OK).send({
                status: 'success',
                data
            });
        })
        .catch(error => {
            console.log('getTeams', error);
            return res.status(status.INTERNAL_SERVER_ERROR).send({
                status: 'error'
            });
        });
}

function getTeamMembers(req, res) {
    TeamController.getMembersById(req.user.team)
        .then(data => {
            return res.status(status.OK).send({
                status: 'success',
                data
            });
        })
        .catch(error => {
            console.log('getTeamMembers', error);
            return res.status(status.INTERNAL_SERVER_ERROR).send({
                status: 'error'
            });
        });
}

function getTeamSubmission(req, res) {
    ProjectController.getByTeamId(req.user.team).then(data => {
        return res.status(status.OK).send({
            status: 'success',
            data
        });
    }).catch(error => {
        console.log('getTeamSubmission', error);
        return res.status(status.INTERNAL_SERVER_ERROR).send({
            status: 'error'
        });
    });
}

function createTeam(req, res) {
    const { eventId, teamMembers, contactPhone } = req.body;

    TeamController.create(eventId, teamMembers, contactPhone)
        .then(data => {
            return res.status(status.OK).send({
                status: 'success',
                data
            });
        })
        .catch(error => {
            console.log('createTeam', error);
            return res.status(status.INTERNAL_SERVER_ERROR).send({
                status: 'error'
            });
        });
}

function addTeamMember(req, res) {
    const { name, email } = req.body;
    const { team } = req.user;

    AnnotatorController.create(name, email, team)
        .then(annotator => {
            TeamController.addMembers(teamId, annotator._id).then(data => {
                return res.status(status.OK).send({
                    status: 'success',
                    data
                });
            });
        })
        .catch(error => {
            console.log('addTeamMember', error);
            return res.status(status.INTERNAL_SERVER_ERROR).send({
                status: 'error'
            });
        });
}

function removeTeamMember(req, res) {
    const { email } = req.body;
    const { team } = req.user;

    AnnotatorController.findByEmail(email)
        .then(annotator => {
            TeamController.removeMembers(team, annotator._id).then(data => {
                return res.status(status.OK).send({
                    status: 'success',
                    data
                });
            });
        })
        .catch(error => {
            console.log('removeTeamMember', error);
            return res.status(status.INTERNAL_SERVER_ERROR).send({
                status: 'error'
            });
        });
}
