'use strict';
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Joi = require('joi');
const EventController = require('../controllers/Event');

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

    image: String,
    github: String,
    track: String,
    challenges: [String],
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
    const keys = {
        name: Joi.string()
            .min(1)
            .max(120)
            .required(),
        description: Joi.string()
            .max(1000)
            .required(),
        location: Joi.string()
            .alphanum()
            .min(1)
            .max(5)
            .required(),
        track: Joi.string(),
        challenges: Joi.array().items(Joi.string()),
        image: Joi.string()
            .uri()
            .optional()
            .trim(),
        github: Joi.string()
            .uri()
            .optional()
            .trim(),
        team: Joi.string().required()
    };

    return EventController.getEventWithId(item.event).then(event => {
        if (event.hasChallenges) {
            keys.challenges = Joi.array()
                .items(Joi.string().valid(event.challenges))
                .min(1)
                .max(5)
                .required();
        }

        if (event.hasTracks) {
            keys.track = Joi.string()
                .valid(event.tracks)
                .required();
        }

        const schema = Joi.object().keys(keys);
        return schema.validate(item, { stripUnknown: true });
    });
};

module.exports = {
    Project,
    validate
};
