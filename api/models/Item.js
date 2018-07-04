'use strict';
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Joi = required('joi');
const Promise = require('bluebird');
const uuid = require('uuid/v4');

const ItemSchema = new Schema({
	name: {
		type: String,
		required: true
	},
	location: {
		type: String,
		require: true
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
	viewed: {
		type: Schema.Types.ObjectId,
		ref: 'Annotator',
		required: true
	},
	description: String,
	mu: Number,
	sigma: Number,
})


const Item = mongoose.model('Item',ItemSchema);

const validate = function (item) {
	const schema = Joi.object().keys({
		name: Joi.string().alpha().min(1).max(120).required(),
	});

	return new Promise(function (resolve, reject) {
		Joi.validate(item, schema, function (err, value){
			if (err !== null){
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
	return item.find({});
}

const findById = function (id) {
	return Item.findById(id);
}

const deleteById = function (id) {
	return Item.deleteById(id).remove().exec();
}

module.exports = {
	Item,
	validate,
	create,
	getAll,
	findById,
	deleteById,
};
