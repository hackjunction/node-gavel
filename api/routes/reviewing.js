'use strict';

const status = require('http-status');
const Item = require('../models/Item');
const Annotator = require('../models/Annotator');
const Decision = require('../models/Decision');
const Errors = require('../services/errors');
const ReviewingService = require('../services/reviewing');

module.exports = function(app) {
    app.route('/api/reviewing/welcome/:annotatorSecret').get(setHasReadWelcome);

    app.route('/api/reviewing/next/:annotatorSecret').get(getNextDecision);

    app.route('/api/reviewing/skip/:annotatorSecret').get(skipDecision);

    app.route('/api/reviewing/vote/').post(submitVote);
};

function setHasReadWelcome(req, res) {
    const secret = req.params.annotatorSecret;

    Annotator.setHasReadWelcome(secret)
        .then(annotator => {
            return res.status(status.OK).send({
                status: 'success',
                data: annotator
            });
        })
        .catch(error => {
            console.log('Error', error);
            return Errors.invalidSecretError(res);
        });
}

function getNextDecision(req, res) {
    const secret = req.params.annotatorSecret;

    Annotator.findBySecret(secret)
        .then(annotator => {
            // Annotator has not read instructions yet
            if (annotator.read_welcome === false) {
                return Errors.annotatorNotReadWelcomeError(res);
            }

            // Annotator has been disabled via admin panel
            if (annotator.active === false) {
                return Errors.annotatorDisabledError(res);
            }

            // If no previous item, this is the first vote of the annotator
            if (!annotator.prev && !annotator.next) {
                return ReviewingService.initAnnotator(annotator).then(newAnnotator => {
                    if (!annotator.next) {
                        return Errors.annotatorWaitError(res);
                    }

                    return res.status(status.OK).send({
                        status: 'success',
                        data: {
                            prev: null,
                            current: newAnnotator.next
                        }
                    });
                });
            }

            // If no next item, there are (currently) no items left to review
            if (!annotator.next) {
                return Errors.annotatorWaitError(res);
            }

            return Promise.all([Item.findById(annotator.prev, false), Item.findById(annotator.next, false)]).then(
                items => {
                    return res.status(status.OK).send({
                        status: 'success',
                        data: {
                            prev: items[0],
                            current: items[1]
                        }
                    });
                }
            );
        })
        .catch(error => {
            console.log('ERROR', error);
            return Errors.invalidSecretError(res);
        });
}

function skipDecision(req, res) {
    const secret = req.params.annotatorSecret;

    Annotator.findBySecret(secret)
        .then(annotator => {
            // Annotator has not read instructions yet
            if (annotator.read_welcome === false) {
                return Errors.annotatorNotReadWelcomeError(res);
            }

            // Annotator has been disabled via admin panel
            if (annotator.active === false) {
                return Errors.annotatorDisabledError(res);
            }

            // If annotator has no current decision, there's nothing to skip
            if (!annotator.next && !annotator.prev) {
                return Errors.invalidActionError(res, 'Annotator has no current decision to skip');
            }

            return ReviewingService.skipDecision(annotator).then(newAnnotator => {
                // If annotator next is now null, annotator should wait for new projects
                if (!newAnnotator.next) {
                    return Errors.annotatorWaitError(res);
                }

                return Promise.map([Item.findById(annotator.prev, false), Item.findById(annotator.next, false)]).then(
                    items => {
                        return res.status(status.OK).send({
                            status: 'success',
                            data: {
                                prev: items[0],
                                current: items[1]
                            }
                        });
                    }
                );
            });
        })
        .catch(error => {
            console.log('ERROR', error);
            return Errors.invalidSecretError(res);
        });
}

function submitVote(req, res) {
    const secret = req.body.annotatorSecret;
    const decision = req.body.decision;

    return Annotator.findBySecret(secret)
        .then(annotator => {
            if (annotator.read_welcome === false) {
                return Errors.annotatorNotReadWelcomeError(res);
            }

            if (!annotator.next) {
                return Errors.invalidActionError(
                    res,
                    'Annotator has no current project, call /api/reviewing/next first to init annotator'
                );
            }

            if (!annotator.prev) {
                return ReviewingService.setFirstProjectSeen(annotator).then(annotator => {
                    return Item.findById(annotator.prev)
                        .then(item => {
                            item.viewed.push(annotator._id);
                            return item.save();
                        })
                        .then(item => {
                            annotator.prev = item;
                            return res.status(status.OK).send({
                                status: 'success',
                                data: annotator
                            });
                        });
                });
            }

            return Promise.map([annotator.prev, annotator.next], itemId => {
                return Item.findById(itemId);
            })
                .then(items => {
                    const prev = items[0];
                    const next = items[1];

                    if (prev.active && next.active) {
                        if (decision === 'previous') {
                            const data = ReviewingService.performVote(annotator, next, prev, false);
                            return Decision.create(data.annotator, data.winner, data.loser).then(() => {
                                return {
                                    annotator: data.annotator,
                                    next: data.loser,
                                    prev: data.winner
                                };
                            });
                        } else if (decision === 'current') {
                            const data = ReviewingService.performVote(annotator, next, prev, true);
                            return Decision.create(data.annotator, data.winner, data.loser).then(() => {
                                return {
                                    annotator: data.annotator,
                                    next: data.winner,
                                    prev: data.loser
                                };
                            });
                        } else {
                            throw new Error(
                                'Invalid decision ' + decision + ', must be one of: ["previous", "current"]'
                            );
                        }
                    }
                })
                .then(data => {
                    data.next.viewed.push(data.annotator._id);
                    data.annotator.prev = data.annotator.next;
                    data.annotator.ignore.push(data.annotator.prev);

                    return Promise.all([data.next.save(), data.annotator.save()]);
                })
                .then(data => {
                    return res.status(status.OK).send({
                        status: 'success',
                        data: data[1]
                    });
                })
                .catch(error => {
                    console.log('Error', error);
                    return res.status(status.INTERNAL_SERVER_ERROR).send({
                        status: 'error',
                        message: 'See console for details'
                    });
                });
        })
        .catch(error => {
            console.log('ERROR', error);
            return Errors.invalidSecretError(res);
        });
}
