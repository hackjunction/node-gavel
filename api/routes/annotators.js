'use strict';

const status = require('http-status');
const passport = require('passport');
const ReviewingService = require('../services/reviewing');
const AnnotatorController = require('../controllers/Annotator');
const EventController = require('../controllers/Event');

module.exports = function(app) {
    /**
     * Get all annotators for an event
     * -> Requires admin token
     */
    app.get(
        '/api/annotators/event/:eventId',
        passport.authenticate('admin', { session: false }),
        getAnnotatorsForEvent
    );

    /**
     * Create an annotator for an event (via the admin panel)
     * -> Requires admin token
     */
    app.post('/api/annotators', passport.authenticate('admin', { session: false }), createAnnotator);

    /**
     * Set an annotator as disabled
     * -> Requires admin token
     */
    app.get(
        '/api/annotators/disable/:annotatorId',
        passport.authenticate('admin', { session: false }),
        disableAnnotator
    );

    /**
     * Set an annotator as enabled (default)
     * -> Requires admin token
     */
    app.get('/api/annotators/enable/:annotatorId', passport.authenticate('admin', { session: false }), enableAnnotator);

    /**
     * Get an annotator
     * -> Requires annotator secret
     */
    app.get('/api/annotators/', passport.authenticate('annotator', { session: false }), getAnnotator);

    /**
     * Set an annotator as having read the welcome message (which allows them to begin voting)
     * -> Requires annotator secret
     */
    app.get('/api/annotators/init', passport.authenticate('annotator', { session: false }), initAnnotator);

    /**
     * Submit a vote for an annotator, based on their current next and prev projects
     * -> Requires annotator secret
     */
    app.get('/api/annotators/vote/:choice', passport.authenticate('annotator', { session: false }), submitVote);

    /**
     * Get an annotator's event
     * -> Requires annotator secret
     */
    app.get('/api/annotators/event', passport.authenticate('annotator', { session: false }), getEventForAnnotator);
};

function getAnnotator(req, res) {
    //Passport already gets the annotator for us in req.user
    return res.status(status.OK).send({
        status: 'success',
        data: req.user
    });
}

function initAnnotator(req, res) {
    return ReviewingService.initAnnotator(req.user)
        .then(annotator => {
            return res.status(status.OK).send({
                status: 'success',
                data: annotator
            });
        })
        .catch(error => {
            console.log('initAnnotator', error);
            return res.status(status.INTERNAL_SERVER_ERROR).send({
                status: 'error'
            });
        });
}

function submitVote(req, res) {
    return ReviewingService.submitVote(req.user, req.params.choice)
        .then(annotator => {
            return res.status(status.OK).send({
                status: 'success',
                data: annotator
            });
        })
        .catch(error => {
            console.log('submitVote', error);
            return res.status(status.INTERNAL_SERVER_ERROR).send({
                status: 'error'
            });
        });
}

function getEventForAnnotator(req, res) {
    return EventController.getEventWithId(req.user.event)
        .then(event => {
            return res.status(status.OK).send({
                status: 'success',
                data: {
                    ...event,
                    apiKey: null
                }
            });
        })
        .catch(error => {
            console.log('getEventForAnnotator', error);
            return res.status(status.INTERNAL_SERVER_ERROR).send({
                status: 'error'
            });
        });
}

function getAnnotatorsForEvent(req, res) {
    return AnnotatorController.getByEvent(req.params.eventId)
        .then(annotators => {
            return res.status(status.OK).send({
                status: 'success',
                data: annotators
            });
        })
        .catch(error => {
            console.log('getAnnotatorsForEvent', error);
            return res.status(status.INTERNAL_SERVER_ERROR).send({
                status: 'error'
            });
        });
}

function createAnnotator(req, res) {
    const { name, email, eventId } = req.body;
    console.log('!!!!!TODO: Send an email to the created annotator');
    return AnnotatorController.create(name, email, null, eventId)
        .then(annotator => {
            return res.status(status.OK).send({
                status: 'success',
                data: annotator
            });
        })
        .catch(error => {
            console.log('createAnnotator', error);
            return res.status(status.INTERNAL_SERVER_ERROR).send({
                status: 'error'
            });
        });
}

function disableAnnotator(req, res) {
    return AnnotatorController.disable(req.params.annotatorId)
        .then(annotator => {
            return res.status(status.OK).send({
                status: 'success',
                data: annotator
            });
        })
        .catch(error => {
            console.log('disableAnnotator', error);
            return res.status(status.INTERNAL_SERVER_ERROR).send({
                status: 'error'
            });
        });
}

function enableAnnotator(req, res) {
    return AnnotatorController.enable(req.params.annotatorId)
        .then(annotator => {
            return res.status(status.OK).send({
                status: 'success',
                data: annotator
            });
        })
        .catch(error => {
            console.log('enableAnnotator', error);
            return res.status(status.INTERNAL_SERVER_ERROR).send({
                status: 'error'
            });
        });
}
