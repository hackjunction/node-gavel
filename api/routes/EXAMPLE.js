'use strict'

const status = require('http-status');

module.exports = function (app) {

	app.get('/', function (req, res) {

		res.status(status.OK).send({
			status: 'success',
			data: {
				message: 'hello'
			}
		});
	});

	app.get('/testQuery', function (req, res) {

		res.status(status.OK).send({
			status: 'success',
			data: req.query
		});
	});
}