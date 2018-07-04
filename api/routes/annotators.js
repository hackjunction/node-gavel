'use strict'

const status = require('http-status');
const Annotator = require('../models/Annotator');

module.exports = function (app) {

	app.route('/annotators')
		.get(getAllAnnotators)
		.post(createAnnotator);

	app.route('/annotators/:annotatorId')
		.get(getAnnotatorById)
		.delete(deleteAnnotatorById);
}

function getAllAnnotators(req, res) {

	Annotator.getAll().then((annotators) => {
		return res.status(status.OK).send({
			status: 'success',
			data: annotators
		});
	}).catch((error) => {
		console.log('Error', error);
		return res.status(status.INTERNAL_SERVER_ERROR).send({
			status: 'error',
			message: 'See console for details'
		});
	});
}

function createAnnotator(req, res) {

	const doc = {
		name: req.body.name,
		email: req.body.email
	};

	Annotator.create(doc).then((annotator) => {
		return res.status(status.OK).send({
			status: 'success',
			data: annotator
		});
	}).catch((error) => {
		console.log('Error', error);
		return res.status(status.INTERNAL_SERVER_ERROR).send({
			status: 'error',
			message: 'See console for details'
		});
	});
}

function getAnnotatorById(req, res) {
	const id = req.params.annotatorId;

	Annotator.findById(id).then((annotator) => {
		return res.status(status.OK).send({
			status: 'success',
			data: annotator
		});
	}).catch((error) => {
		console.log('Error', error);
		return res.status(status.INTERNAL_SERVER_ERROR).send({
			status: 'error',
			message: 'See console for details'
		});
	});
}

function deleteAnnotatorById(req, res) {
	const id = req.params.annotatorId;

	Annotator.deleteById(id).then(() => {
		return res.status(status.OK).send({
			status: 'success'
		});
	}).catch((error) => {
		console.log('Error', error);
		return res.status(status.INTERNAL_SERVER_ERROR).send({
			status: 'error',
			message: 'See console for details'
		});
	});
}
