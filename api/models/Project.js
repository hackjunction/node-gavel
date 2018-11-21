'use strict';
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Joi = require('joi');
const _ = require('lodash');
const EventController = require('../controllers/Event');
const Settings = require('../settings');

const ProjectSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    punchline: String,
    /** Additional project info */
    description: String,
    image: String,
    source: String,
    track: String,
    challenges: [String],
    contactPhone: String,
    source_public: Boolean,
    members_public: Boolean,
    /** END project info*/
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
    viewed_by: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Annotator'
        }
    ],
    skipped_by: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Annotator'
        }
    ],
    mu: {
        type: Number,
        default: Settings.MATH.MU_PRIOR
    },
    sigma_sq: {
        type: Number,
        default: Settings.MATH.SIGMA_SQ_PRIOR
    },
    created: {
        type: Date,
        default: Date.now
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
            .max(3000)
            .optional(),
        punchline: Joi.string()
            .max(100)
            .required(),
        location: Joi.string()
            .alphanum()
            .min(1)
            .max(5)
            .required(),
        contactPhone: Joi.string().optional(),
        track: Joi.string(),
        challenges: Joi.array().items(Joi.string()),
        image: Joi.string()
            .uri()
            .optional()
            .trim(),
        source: Joi.string()
            .uri()
            .optional()
            .trim(),
        source_public: Joi.boolean().optional(),
        members_public: Joi.boolean().optional(),
        team: Joi.string().required(),
        event: Joi.string().required()
    };

    return EventController.getEventWithId(item.event).then(event => {
        if (event.hasChallenges) {
            keys.challenges = Joi.array()
                .items(Joi.string().valid(_.map(event.challenges, c => c._id.toString())))
                .min(1)
                .max(5)
                .required();
        }

        if (event.hasTracks) {
            keys.track = Joi.string()
                .valid(_.map(event.tracks, t => t._id.toString()))
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
