'use strict'

const status = require('http-status');
const Item = require('../models/Item');

module.exports = function (app) {

	app.route('/reviewing/next/:annotatorSecret')
		.get(getNextDecision)

	app.route('/reviewing/skip/:annotatorSecret')
		.get(skipDecision)

	app.route('/reviewing/vote/:annotatorSecret')
		.post(submitVote)
}

function getNextDecision() {
	//TODO: Implement
	return res.status(status.OK).send({
		status: 'success',
		message: 'ROUTE NOT IMPLEMENTED'
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

