'use strict'

const status = require('http-status');

module.exports = function (app) {

	app.post('/annotators/create', function (req, res) {
		const doc = {
			name: req.body.name,
			email: req.body.email
		};

		mongoose.model('Annotator').creat
	});
}