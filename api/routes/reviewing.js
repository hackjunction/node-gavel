'use strict'

const status = require('http-status');
const Item = require('../models/Item');
const Annotator = require('../models/Annotator');
const Errors = require('../services/errors');
const ReviewingService = require('../services/reviewing');

module.exports = function (app) {

	app.route('/reviewing/next/:annotatorSecret')
		.get(getNextDecision)

	app.route('/reviewing/skip/:annotatorSecret')
		.get(skipDecision)

	app.route('/reviewing/vote/:annotatorSecret')
		.post(submitVote)
}

function getNextDecision(req, res) {

	const secret = req.params.annotatorSecret;

	Annotator.findBySecret(secret).then((annotator) => {

		// Annotator has not read instructions yet
		if (annotator.read_welcome === false) {
			return Errors.annotatorNotReadWelcomeError(res);
		}

		// Annotator has been disabled via admin panel
		if (annotator.active === false) {
			return Errors.annotatorDisabledError(res);
		}

		// If no previous item, this is the first vote of the annotator
		if (!annotator.prev) {
			return ReviewingService.initAnnotator(annotator).then((newAnnotator) => {
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

		// Otherwise, return previous and current items
		return res.status(status.OK).send({
			status: 'success',
			data: {
				prev: annotator.prev,
				current: annotator.next
			}
		});
	}).catch((error) => {
		console.log('ERROR', error);
		return Errors.invalidSecretError(res);
	});
}

function skipDecision(req, res) {

	const secret = req.params.annotatorSecret;

	Annotator.findBySecret(secret).then((annotator) => {

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

		return ReviewingService.skipDecision(annotator).then((newAnnotator) => {

			// If annotator next is now null, annotator should wait for new projects
			if (!newAnnotator.next) {
				return Errors.annotatorWaitError(res);
			}

			return res.send(status.OK).send({
				status: 'success',
				data: {
					prev: annotator.prev,
					current: annotator.next
				}
			});
		});
	}).catch((error) => {
		console.log('ERROR', error);
		return Errors.invalidSecretError(res);
	})
}

function submitVote(req, res) {

	const secret = req.params.annotatorSecret;
	const decision = req.body.decision;

	Annotator.findBySecret(secret).then((annotator) => {

		if (annotator.read_welcome === false) {
			return Errors.annotatorNotReadWelcomeError(res);
		}
		//TODO: submit the vote
		return res.status(status.OK).send({
			status: 'success',
			data: annotator
		});
	}).catch((error) => {
		console.log('ERROR', error);
		return Errors.invalidSecretError(res);
	});
}

