'use strict';
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Joi = require('joi');

const DecisionSchema = new Schema({
    annotator: {
        type: Schema.Types.ObjectId,
        ref: 'Annotator',
        required: true
    },

    event: {
        type: Schema.Types.ObjectId,
        ref: 'Event',
        required: true
    },

    winner: {
        type: Schema.Types.ObjectId,
        ref: 'Project',
        required: true
    },

    loser: {
        type: Schema.Types.ObjectId,
        ref: 'Project',
        required: true
    },

    timestamp: {
        type: Date,
        default: Date.now
    }
});

const Decision = mongoose.model('Decision', DecisionSchema);

/** Validates decision
 *
 * Returns: Promise resolved with cleaned decision data,
 * or Promise rejected with error details
 */
const validate = function(decision) {
    const schema = Joi.object().keys({
        annotator: Joi.string().required(),
        winner: Joi.string().required(),
        loser: Joi.string().required(),
        timestamp: Joi.date().required(),
        event: Joi.string().required()
    });

    return schema.validate(decision);
};

module.exports = {
    Decision,
    validate
};
