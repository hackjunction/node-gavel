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
        required: true
    },
    tracks: [String],
    hasChallenges: {
        type: Boolean,
        required: true
    },
    challenges: [String],
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
    participantCode: {
        type: String,
        required: true
    },
    apiKey: {
        type: String,
        required: true
    }
});

const DATE_FORMAT = 'DD.MM.YYYY HH:mm';
const validate = data => {
    if (!moment.tz.zone(data.timezone)) {
        return Promise.reject(new Error('Invalid timezone ' + data.timezone));
    }

    const cleaned = {
        ...data,
        startTime: moment(data.startTime, DATE_FORMAT)
            .tz(data.timezone)
            .toDate(),
        endTime: moment(data.endTime, DATE_FORMAT)
            .tz(data.timezone)
            .toDate(),
        submissionDeadline: moment(data.submissionDeadline, DATE_FORMAT)
            .tz(data.timezone)
            .toDate(),
        votingStartTime: moment(data.votingStartTime, DATE_FORMAT)
            .tz(data.timezone)
            .toDate(),
        votingEndTime: moment(data.votingEndTime, DATE_FORMAT)
            .tz(data.timezone)
            .toDate(),
        tracks: data.hasTracks ? data.tracks : [],
        challenges: data.hasChallenges ? data.challenges : []
    };

    //TODO: Define more strict schema, shared validation for front/backend
    const schema = Joi.object().keys({
        name: Joi.string().trim(),
        hasTracks: Joi.boolean(),
        tracks: Joi.array().items(Joi.string().trim()),
        hasChallenges: Joi.boolean(),
        challenges: Joi.array().items(Joi.string().trim()),
        timezone: Joi.string(),
        startTime: Joi.date(),
        endTime: Joi.date(),
        submissionDeadline: Joi.date(),
        votingStartTime: Joi.date(),
        votingEndTime: Joi.date(),
        participantCode: Joi.string(),
        apiKey: Joi.string()
    });

    return schema.validate(cleaned);
};

//TODO: set up indexes

const Event = mongoose.model('Event', EventSchema);

module.exports = {
    Event,
    validate
};
