const EventController = require('../controllers/Event');
const ChallengeWinnersController = require('../controllers/ChallengeWinners');
const status = require('http-status');
const passport = require('passport');
const Utils = require('../services/utils');

module.exports = function (app) {
    /**
     * Create a new event, or update an existing one
     * -> Requires admin token
     */
    app.post('/api/events', passport.authenticate('admin', { session: false }), createEvent);

    /**
     * Get all events
     * -> Requires admin token
     */
    app.get('/api/events', passport.authenticate('admin', { session: false }), getAllEvents);

    /**
     * Get an event by id
     * -> Requires admin token
     */
    app.get('/api/events/:eventId', passport.authenticate('admin', { session: false }), getEventWithId);

    /**
     * Get challenges for an event
     * -> Requires admin token
     */
    app.get('/api/events/:eventId/challenges', passport.authenticate('admin', { session: false }), getEventChallenges);

    /**
     * Get winners for an event's challenges
     * -> Requires admin token
     */
    app.get('/api/events/:eventId/winners', passport.authenticate('admin', { session: false }), getEventChallengeWinners);

    /**
     * Extend submission deadline by 15 minutes
     * -> Requires admin token
     */
    app.get(
        '/api/events/extend/:eventId',
        passport.authenticate('admin', { session: false }),
        extendSubmissionDeadline
    );

    /**
     * Toggle track winners public
     * -> Requires admin token
     */
    app.get(
        '/api/events/track-winners-public/:eventId',
        passport.authenticate('admin', { session: false }),
        toggleTrackWinnersPublic
    );

    /**
     * Toggle finalist voting open
     * -> Requires admin token
     */
    app.get(
        '/api/events/finalist-voting-open/:eventId',
        passport.authenticate('admin', { session: false }),
        toggleFinalistVotingOpen
    );
};

function createEvent(req, res) {
    EventController.create(req.body.event)
        .then(data => {
            return res.status(status.OK).send({
                status: 'success',
                data
            });
        })
        .catch(error => {
            console.log('createEvent', error);
            return res.status(status.INTERNAL_SERVER_ERROR).send({
                status: 'error'
            });
        });
}

function getEventChallenges(req, res) {
    EventController.getChallengesForEvent(req.params.eventId)
        .then(challenges => {
            return res.status(status.OK).send({
                status: 'success',
                data: challenges
            });
        })
        .catch(error => {
            console.log('getEventChallenges', error);
            return res.status(status.INTERNAL_SERVER_ERROR).send({
                status: 'error'
            });
        });
}

function getEventChallengeWinners(req, res) {
    ChallengeWinnersController.getByEvent(req.params.eventId)
        .then(winners => {
            return res.status(status.OK).send({
                status: 'success',
                data: winners
            });
        })
        .catch(error => {
            console.log('getEventChallengeWinners', error);
            return res.status(status.INTERNAL_SERVER_ERROR).send({
                status: 'error'
            });
        })
}

function getAllEvents(req, res) {
    EventController.getAll()
        .then(data => {
            return res.status(status.OK).send({
                status: 'success',
                data
            });
        })
        .catch(error => {
            console.log('getAllEvents', error);
            return res.status(status.INTERNAL_SERVER_ERROR).send({
                status: 'error'
            });
        });
}

function getEventWithId(req, res) {
    EventController.getEventWithId(req.params.eventId)
        .then(data => {
            return res.status(status.OK).send({
                status: 'success',
                data
            });
        })
        .catch(error => {
            console.log('getEventWithId', error);
            return res.status(status.INTERNAL_SERVER_ERROR).send({
                status: 'error'
            });
        });
}

function extendSubmissionDeadline(req, res) {
    EventController.extendSubmissionDeadline(req.params.eventId)
        .then(data => {
            return res.status(status.OK).send({
                status: 'success',
                data
            });
        })
        .catch(error => {
            console.log('extendSubmissionDeadline', error);
            return res.status(status.INTERNAL_SERVER_ERROR).send({
                status: 'error'
            });
        });
}

function toggleTrackWinnersPublic(req, res) {
    const { eventId } = req.params;
    const { public } = req.query;

    console.log('QUERY', req.query);


    EventController.setTrackWinnersPublic(eventId, public).then(event => {
        return res.status(status.OK).send({
            status: 'success',
            data: event
        });
    }).catch(error => {
        console.log('toggleTrackWinnersPublic', error);
        return res.status(status.INTERNAL_SERVER_ERROR).send({
            status: 'error'
        });
    })
}

function toggleFinalistVotingOpen(req, res) {
    const { eventId } = req.params;
    const { open } = req.query;

    EventController.setFinalistVotingOpen(eventId, open).then(event => {
        return res.status(status.OK).send({
            status: 'success',
            data: event
        });
    }).catch(error => {
        console.log('toggleFinalistVotingOpen', error);
        return res.status(status.INTERNAL_SERVER_ERROR).send({
            status: 'error'
        });
    })
}