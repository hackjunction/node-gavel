'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var AnnotatorSchema = new Schema({
	name: {
		type: String,
		required: true,
	},
});

schema.path('name').validate(function (value) {
	if (value.length > 120) {
		return false;
	}
	return true;
});

module.exports = mongoose.model('Annotator', AnnotatorSchema);