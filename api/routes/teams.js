// 'use strict';
const status = require('http-status');
const passport = require('passport');
const TeamController = require('../controllers/Team');
const { Team } = require('../models/Team');

module.exports = function(app) {
    /* Requires admin token */
    app.get('/api/teams', passport.authenticate('admin', { session: false }), getTeams);

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
            return res.status(status.INTERNAL_SERVER_ERROR).send({
                status: 'error'
            });
        });
}

function createTeam(req, res) {
    TeamController.create(req.body.eventId)
        .then(data => {
            return res.status(status.OK).send({
                status: 'success',
                data
            });
        })
        .catch(error => {
            return res.status(status.INTERNAL_SERVER_ERROR).send({
                status: 'error'
            });
        });
}
