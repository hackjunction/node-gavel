'use strict';
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Joi = require('joi');
const moment = require('moment-timezone');
const Promise = require('bluebird');

const EventSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    hasTracks: {
        type: Boolean,
        default: true,
        required: true
    },
    tracks: [
        {
            name: String
        }
    ],
    hasChallenges: {
        type: Boolean,
        default: true,
        required: true
    },
    challenges: [
        {
            name: String,
            partner: String
        }
    ],
    timezone: {
        type: String,
        required: true
    },
    startTime: {
        type: Date,
        required: true
    },
    endTime: {
        type: Date,
        required: true
    },
    submissionDeadline: {
        type: Date,
        required: true
    },
    votingStartTime: {
        type: Date,
        required: true
    },
    votingEndTime: {
        type: Date,
        required: true
    },
    apiKey: {
        type: String,
        required: true
    },
    track_winners_public: {
        type: Boolean,
        default: false
    },
    finalist_voting_open: {
        type: Boolean,
        default: false
    }
});

const validate = data => {
    if (!moment.tz.zone(data.timezone)) {
        return Promise.reject(new Error('Invalid timezone ' + data.timezone));
    }

    console.log('DATA', data);

    //TODO: Define more strict schema, shared validation for front/backend
    const schema = Joi.object().keys({
        name: Joi.string().trim(),
        tracks: Joi.array()
            .min(1)
            .max(20),
        challenges: Joi.array()
            .min(1)
            .max(100),
        timezone: Joi.string(),
        startTime: Joi.date(),
        endTime: Joi.date(),
        submissionDeadline: Joi.date(),
        votingStartTime: Joi.date(),
        votingEndTime: Joi.date(),
        apiKey: Joi.string()
    });

    return schema.validate(data, { allowUnknown: true });
};

//TODO: set up indexes

const Event = mongoose.model('Event', EventSchema);

module.exports = {
    Event,
    validate
};
