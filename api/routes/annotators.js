'use strict';

const status = require('http-status');
const passport = require('passport');
const _ = require('lodash');
const ReviewingService = require('../services/reviewing');
const AnnotatorController = require('../controllers/Annotator');
const EventController = require('../controllers/Event');

module.exports = function (app) {
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
     * Get the current decision for an annotator
     * -> Requires annotator secret
     */
    app.get('/api/annotators/decision', passport.authenticate('annotator', { session: false }), getNextDecision);

    /**
     * Set an annotator as having read the welcome message (which allows them to begin voting)
     * -> Requires annotator secret
     */
    app.get('/api/annotators/init', passport.authenticate('annotator', { session: false }), initAnnotator);

    /**
     * Set an annotator as onboarded (they will no longer be shown a tutorial)
     * -> Requires annotator secret
     */
    app.get('/api/annotators/onboarded', passport.authenticate('annotator', { session: false }), setOnboarded);

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

    /**
     * Set an annotator's finalist vote
     * -> Requires annotator secret
     */
    app.get('/api/annotators/set-finalist-vote/:projectId', passport.authenticate('annotator', { session: false }), setAnnotatorVotedFor);
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

function setOnboarded(req, res) {
    return AnnotatorController.setOnboarded(req.user._id.toString())
        .then(annotator => {
            return res.status(status.OK).send({
                status: 'succes',
                data: annotator
            });
        })
        .catch(error => {
            console.log('setOnboarded', error);
            return res.status(status.INTERNAL_SERVER_ERROR).send({
                status: 'error'
            });
        });
}

function getNextDecision(req, res) {
    return ReviewingService.getNextDecision(req.user)
        .then(data => {
            return res.status(status.OK).send({
                status: 'success',
                data
            });
        })
        .catch(error => {
            console.log('getNextDecision', error);
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

function setAnnotatorVotedFor(req, res) {
    const userId = req.user._id.toString();
    const projectId = req.params.projectId;

    return AnnotatorController.setVotedFor(projectId, userId).then((annotator) => {
        return res.status(status.OK).send({
            status: 'success',
            data: annotator
        });
    }).catch(error => {
        return res.status(status.INTERNAL_SERVER_ERROR).send({
            status: 'error'
        });
    })
}