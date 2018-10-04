'use strict';
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Joi = require('joi');
const Promise = require('bluebird');
const uuid = require('uuid/v4');
const ObjectId = require('mongodb').ObjectId;
const SETTINGS = require('../../settings.json');

const EventSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    secretCode: {
        type: String,
        required: true,
        unique: true
    }
});

EventSchema.index({ secretCode: 1 });

const Event = mongoose.model('Event', EventSchema);

//TODO: Validation of new event
//TODO: "Class methods";

module.exports = {
    Event
};
