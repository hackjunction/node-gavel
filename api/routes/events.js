const status = require('http-status');
const passport = require('passport');
const _ = require('lodash');
const EventController = require('../controllers/Event');
const ChallengeWinnersController = require('../controllers/ChallengeWinners');
const ProjectController = require('../controllers/Project');
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
     * Get all events, with public info only
     */
    app.get('/api/events/public', getAllEventsPublic);


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

    /**
     * Get track winners
     * -> Requires annotator secret
     */

    app.get(
        '/api/events/track-winners/:eventId',
        passport.authenticate('annotator', { session: false }),
        getTrackWinners
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

function getAllEventsPublic(req, res) {
    EventController.getAllPublic()
        .then(data => {
            console.log('DATA', data);
            return res.status(status.OK).send({
                status: 'success',
                data
            });
        }).catch(error => {
            return res.status(status.INTERNAL_SERVER_ERROR).send({
                status: 'error'
            });
        })
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

function getTrackWinners(req, res) {
    const eventId = req.user.event;

    EventController.getEventWithId(eventId).then(event => {
        if (!event.track_winners_public) {
            return Promise.reject('Track winners are not public');
        }

        return ProjectController.getByEvent(eventId).then(projects => {
            const byTrack = _.groupBy(projects, 'track');

            const winners = [];

            _.forOwn(byTrack, (projects, trackId) => {
                const eligible = _.filter(projects, 'active');
                const track = _.find(event.tracks, (t) => t._id.toString() === trackId);
                winners.push({
                    track,
                    winner: _.maxBy(eligible, 'mu')
                });
            });

            return winners;
        });
    }).then(winners => {
        return res.status(status.OK).send({
            status: 'success',
            data: winners
        });
    }).catch(error => {
        console.log('getTrackWinners', error);
        return res.status(status.INTERNAL_SERVER_ERROR).send({
            status: 'error'
        })
    });
}