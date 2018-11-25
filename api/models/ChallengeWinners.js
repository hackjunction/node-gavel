'use strict';
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Joi = require('joi');

const ChallengeWinnersSchema = new Schema({
	challenge: {
		type: Schema.Types.ObjectId,
		required: true
	},
	event: {
		type: Schema.Types.ObjectId,
		ref: 'Event',
		required: true
	},
	first: {
		type: Schema.Types.ObjectId,
		ref: 'Project',
		required: true
	},
	second: {
		type: Schema.Types.ObjectId,
		ref: 'Project',
	},
	third: {
		type: Schema.Types.ObjectId,
		ref: 'Project',
	},
	comments: String,
	updated: {
		type: Date,
		default: Date.now,
	}
});

const ChallengeWinners = mongoose.model('ChallengeWinners', ChallengeWinnersSchema);

/** Validates decision
 */
const validate = function (decision) {

	const schema = Joi.object().keys({
		_id: Joi.string().optional(),
		challenge: Joi.string().required(),
		event: Joi.string().required(),
		first: Joi.string().required(),
		second: Joi.string().optional().allow(null),
		third: Joi.string().optional().allow(null),
		comments: Joi.string().optional().allow(''),
		updated: Joi.date().optional()
	});

	return schema.validate(decision, { stripUnknown: true });
};

module.exports = {
	ChallengeWinners,
	validate
};
