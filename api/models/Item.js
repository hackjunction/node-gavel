'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ItemSchema = new Schema({
	name: {
		type: String,
		required: true
	},
	location: {
		type: String,
		require: true
	},
	description: String,
	mu: Number,
	sigma: Number,
	active: {
		type: Boolean,
		required: true,
		default: false
	},
	prioritized: {
		type: Boolean,
		required: true,
		default: false,
	},
	viewed: {
		type: Schema.Types.ObjectId,
		ref: 'Annotator'
		required: true	
	},
})

module.exports = mongoose.model('Item',ItemSchema)
