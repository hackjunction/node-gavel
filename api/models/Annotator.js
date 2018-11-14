'use strict';
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Joi = require('joi');
const Settings = require('../settings');

const AnnotatorSchema = new Schema({
    name: {
        type: String,
        required: true
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
    onboarded: {
        type: Boolean,
        default: false
    },
    secret: {
        type: String,
        required: true
    },
    next: {
        type: Schema.Types.ObjectId,
        ref: 'Project'
    },
    updated: {
        type: Date
    },
    prev: {
        type: Schema.Types.ObjectId,
        ref: 'Project'
    },
    ignore: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Project'
        }
    ],
    team: {
        type: Schema.Types.ObjectId,
        ref: 'Team'
    },
    event: {
        type: Schema.Types.ObjectId,
        ref: 'Event'
    },
    assigned_track: String,
    alpha: {
        type: Number,
        default: Settings.MATH.ALPHA_PRIOR
    },
    beta: {
        type: Number,
        default: Settings.MATH.BETA_PRIOR
    }
});

AnnotatorSchema.index({ secret: 1 });
AnnotatorSchema.index({ active: 1, updated: 1 });

const Annotator = mongoose.model('Annotator', AnnotatorSchema);

/** Validates annotator data
 *
 * Returns: Promise resolved with cleaned annotator data,
 * or Promise rejected with error details
 */
const validate = function(annotator) {
    const schema = Joi.object().keys({
        name: Joi.string()
            .min(1)
            .max(120)
            .required(),
        email: Joi.string()
            .email()
            .required(),
        team: Joi.any(),
        event: Joi.any()
    });

    return schema.validate(annotator);
};

module.exports = {
    Annotator,
    validate
};
