'use strict'

const status = require('http-status');
const Item = require('../models/Item');

module.exports = function (app) {

	app.route('/api/items')
		.get(getAllItems)
		.post(createItem);

	app.route('/api/items/:itemId')
		.get(getItemById)
		.delete(deleteById);
}

function getAllItems(req, res) {

	Item.getAll().then((items) => {
		return res.status(status.OK).send({
			status: 'success',
			data: items
		});
	}).catch((error) => {
		console.log('Error', error);
		return res.status(status.INTERNAL_SERVER_ERROR).send({
			status: 'error',
			message: 'See console for details'
		});
	});
}

function createItem(req, res) {

	const doc = {
		name: req.body.name,
		location: req.body.location
	};

	console.log(doc);

	Item.create(doc).then((item) => {
		return res.status(status.OK).send({
			status: 'success',
			data: item
		});
	}).catch((error) => {
		console.log('Error', error);
		return res.status(status.INTERNAL_SERVER_ERROR).send({
			status: 'error',
			message: 'See console for details'
		});
	});
}

function getItemById(req, res) {
	const id = req.params.itemId;

	Item.findById(id).then((item) => {
		return res.status(status.OK).send({
			status: 'success',
			data: item
		});
	}).catch((error) => {
		console.log('Error', error);
		return res.status(status.INTERNAL_SERVER_ERROR).send({
			status: 'error',
			message: 'See console for details'
		});
	});
}

function deleteById(req, res) {
	const id = req.params.itemId;

	Item.deleteById(id).then(() => {
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
