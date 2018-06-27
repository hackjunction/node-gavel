'use strict';
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Joi = require('joi');


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
	alpha: Number,
	beta: Number
});

const Annotator = mongoose.model('Annotator', AnnotatorSchema);

/** Validates annotator data
 * 
 * Returns: Promise resolved with cleaned annotator data, 
 * or Promise rejected with error details
 */
const validateAnnotator = function (annotator) {
	const schema = Joi.object().keys({
		name: Joi.string().alpha().min(1).max(120).required(),
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
const createAnnotator = function (data) {
	return validateAnnotator(data).then((validatedData) => {
		const annotator = new Annotator(data).save();
		return annotator.save();
	});
}

module.exports = {
	Annotator,
	validateAnnotator,
	createAnnotator
};