'use strict';
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Joi = require('joi');
const Promise = require('bluebird');
const uuid = require('uuid/v4');
const ObjectId = require('mongodb').ObjectId;
const SETTINGS = require('../../settings.json');


const AnnotatorSchema = new Schema({
	name: {
		type: String,
		required: true,
	},
	email: {
		type: String,
		required: true
	},
	active: {
		type: Boolean,
		default: true
	},
	read_welcome: {
		type: Boolean,
		default: false
	},
	secret: {
		type: String,
		required: true
	},
	next: {
		type: Schema.Types.ObjectId,
		ref: 'Item'
	},
	updated: {
		type: Date
	},
	prev: {
		type: Schema.Types.ObjectId,
		ref: 'Item'
	},
	ignore: [{
		type: Schema.Types.ObjectId,
		ref: 'Item'
	}],
	alpha: {
		type: Number,
		default: 10.0
	},
	beta: {
		type: Number,
		default: 1.0
	}
});

const Annotator = mongoose.model('Annotator', AnnotatorSchema);

/** Validates annotator data
 *
 * Returns: Promise resolved with cleaned annotator data,
 * or Promise rejected with error details
 */
const validate = function (annotator) {
	const schema = Joi.object().keys({
		name: Joi.string().alphanum().min(1).max(120).required(),
		email: Joi.string().email().required()
	});

	return new Promise(function (resolve, reject) {
		Joi.validate(annotator, schema, function (err, value) {
			if (err !== null) {
				return reject(err.details);
			}

			return resolve(value);
		});
	});
}

/* Creates a new Annotator, returns promise */
const create = function (data) {
	return validate(data).then((validatedData) => {
		const annotator = new Annotator(data);
		annotator.secret = uuid();
		return annotator.save();
	});
}
/* Get all annotators, returns promise */
const getAll = function () {
	return Annotator.find({}).exec();
}

/* Find an annotator by their id, returns promise */
const findById = function (id) {
	return Annotator.findById(id);
}

/* Delete an annotator by their id, returns promise */
const deleteById = function (id) {
	return Annotator.findById(id).remove().exec();
}

module.exports = {
	Annotator,
	validate,
	create,
	getAll,
	findById,
	deleteById
};
