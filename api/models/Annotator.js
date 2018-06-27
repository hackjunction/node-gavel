'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var AnnotatorSchema = new Schema({
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

/* Validate name */
schema.path('name').validate(function (value) {
	if (value.length > 120) {
		return false;
	}
	return true;
});

module.exports = mongoose.model('Annotator', AnnotatorSchema);
