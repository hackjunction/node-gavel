'use strict';
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Joi = require('joi');

const ProjectSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    description: String,
    /** TODO: Add Generic details here, such as long description, tech used, image, etc...*/

    team: {
        type: Schema.Types.ObjectId,
        ref: 'Team'
    },
    event: {
        type: Schema.Types.ObjectId,
        ref: 'Event'
    },
    active: {
        type: Boolean,
        required: true,
        default: true
    },
    prioritized: {
        type: Boolean,
        required: true,
        default: false
    },
    viewed: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Annotator'
        }
    ],
    mu: {
        type: Number,
        default: 0.0
    },
    sigma_sq: {
        type: Number,
        default: 0.0
    }
});

ProjectSchema.index({ active: 1, viewed: 1, prioritized: 1, team: 1 });

const Project = mongoose.model('Project', ProjectSchema);

const validate = function(item) {
    const schema = Joi.object().keys({
        name: Joi.string()
            .min(1)
            .max(120)
            .required(),
        description: Joi.string().max(1000),
        location: Joi.string()
            .alphanum()
            .min(1)
            .max(5)
            .required(),
        team: Joi.string().required()
    });

    return schema.validate(item).catch(err => {
        return err.details;
    });
};

module.exports = {
    Project,
    validate
};
