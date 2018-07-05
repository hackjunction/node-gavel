'use strict'

const status = require('http-status');
const Item = require('../models/Item');
const Annotator = require('../models/Annotator');

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
		return res.status(status.INTERNAL_SERVER_ERROR).send({
			status: 'success',
			data: annotator
		});
	}).catch((error) => {
		return res.status(status.INTERNAL_SERVER_ERROR).send({
			status: 'error',
			message: 'No such annotator'
		});
	});
}

function skipDecision() {
	//TODO: Implement
	return res.status(status.OK).send({
		status: 'success',
		message: 'ROUTE NOT IMPLEMENTED'
	});
}

function submitVote() {
	//TODO: Implement
	return res.status(status.OK).send({
		status: 'success',
		message: 'ROUTE NOT IMPLEMENTED'
	});
}

