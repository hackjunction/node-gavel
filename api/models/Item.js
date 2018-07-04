'use strict';
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Joi = require('joi');
const Promise = require('bluebird');
const uuid = require('uuid/v4');

const ItemSchema = new Schema({
	name: {
		type: String,
		required: true
	},
	location: {
		type: String,
		required: true
	},
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
	viewed: [{
		type: Schema.Types.ObjectId,
		ref: 'Annotator',

	}],
	description: String,
	mu: Number,
	sigma: Number,
})


const Item = mongoose.model('Item', ItemSchema);

const validate = function (item) {
	const schema = Joi.object().keys({
		name: Joi.string().alphanum().min(1).max(120).required(),
		description: Joi.string().max(1000),
		location: Joi.string().alphanum().min(1).max(5).required(),
	});

	return new Promise(function (resolve, reject) {
		Joi.validate(item, schema, function (err, value) {
			if (err !== null) {
				return reject(err.details);
			}

			return resolve(value);
		});
	});
}

const create = function (data) {
	return validate(data).then((validatedData) => {
		const item = new Item(data);
		item.secret = uuid();
		return item.save();
	});
}

const getAll = function () {
	return Item.find({});
}

const findById = function (id) {
	return Item.findById(id);
}

const deleteById = function (id) {
	return Item.findById(id).remove().exec();
}

module.exports = {
	Item,
	validate,
	create,
	getAll,
	findById,
	deleteById,
};
