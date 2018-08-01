'use strict'

const status = require('http-status');
const Item = require('../models/Item');
const Annotator = require('../models/Annotator');
const Decision = require('../models/Decision');
const Errors = require('../services/errors');
const ReviewingService = require('../services/reviewing');

module.exports = function (app) {

	app.route('/api/reviewing/next/:annotatorSecret')
		.get(getNextDecision)

	app.route('/api/reviewing/skip/:annotatorSecret')
		.get(skipDecision)

	app.route('/api/reviewing/vote/:annotatorSecret')
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

// annotator = get_current_annotator()
//     if annotator.prev.id == int(request.form['prev_id']) and annotator.next.id == int(request.form['next_id']):
//         if request.form['action'] == 'Skip':
//             annotator.ignore.append(annotator.next)
//         else:
//             # ignore things that were deactivated in the middle of judging
//             if annotator.prev.active and annotator.next.active:
//                 if request.form['action'] == 'Previous':
//                     perform_vote(annotator, next_won=False)
//                     decision = Decision(annotator, winner=annotator.prev, loser=annotator.next)
//                 elif request.form['action'] == 'Current':
//                     perform_vote(annotator, next_won=True)
//                     decision = Decision(annotator, winner=annotator.next, loser=annotator.prev)
//                 db.session.add(decision)
//             annotator.next.viewed.append(annotator) # counted as viewed even if deactivated
//             annotator.prev = annotator.next
//             annotator.ignore.append(annotator.prev)
//         annotator.update_next(choose_next(annotator))
//         db.session.commit()
//     return redirect(url_for('index'))

function submitVote(req, res) {

	const secret = req.params.annotatorSecret;
	const decision = req.body.decision;

	return Annotator.findBySecret(secret).then((annotator) => {

		if (annotator.read_welcome === false) {
			return Errors.annotatorNotReadWelcomeError(res);
		}

		return Promise.map([annotator.prev, annotator.next], (itemId) => {
			return Item.findById(itemId);
		}).then((items) => {
			const prev = items[0];
			const next = items[1];

			if (prev.active && next.active) {
				if (decision === 'previous') {
					return ReviewingService.performVote(annotator, next, prev, false).then((data) => {
						return Decision.create(data.annotator, data.winner, data.loser).then(() => {
							return {
								annotator: data.annotator,
								next: data.loser,
								prev: data.winner
							};
						});
					});
				}
				else if (decision === 'current') {
					return ReviewingService.performVote(annotator, next, prev, true).then((data) => {
						return Decision.create(data.annotator, data.winner, data.loser).then(() => {
							return {
								annotator: data.annotator,
								next: data.winner,
								prev: data.loser
							};
						});
					})
				}
				else {
					throw new Error('Invalid decision ' + decision + ', must be one of: ["previous", "current"]');
				}
			}
		}).then((data) => {

			data.next.viewed.push(data.annotator._id);
			data.annotator.prev = data.annotator.next;
			data.annotator.ignore.push(data.annotator.prev)

			return Promise.map([
				data.next.save(),
				data.annotator.save()
			]);
		}).then((data) => {
			return res.status(status.OK).send({
				status: 'success',
				data: data[1]
			});
		}).catch((error) => {
			console.log('Error', error);
			return res.status(status.INTERNAL_SERVER_ERROR).send({
				status: 'error',
				message: 'See console for details'
			});
		})
	}).catch((error) => {
		console.log('ERROR', error);
		return Errors.invalidSecretError(res);
	});
}

