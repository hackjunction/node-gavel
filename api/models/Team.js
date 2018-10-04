'use strict';
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Joi = require('joi');
const Promise = require('bluebird');
const uuid = require('uuid/v4');
const ObjectId = require('mongodb').ObjectId;
const SETTINGS = require('../../settings.json');

const TeamSchema = new Schema({
    event: {
        type: Schema.Types.ObjectId,
        ref: 'Event'
    },
    secret: {
        type: String
    }
});
// Members are not defined here, but each Annotator has a property teamId for that

const Team = mongoose.model('Team', TeamSchema);

//TODO: Validation of new team
//TODO: "Class methods";
module.exports = {
    Team
};
