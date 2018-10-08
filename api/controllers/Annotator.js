const Promise = require('bluebird');
const uuid = require('uuid/v4');
const Joi = require('joi');
const mongoose = require('mongoose');

const AnnotatorController = {
    create: (name, email, teamId) => {
        const secret = uuid();
        const doc = {
            name,
            email,
            secret,
            team: teamId
        };

        return null;
    },
    createAnnotator: (name, email, teamId) => {
        const secret = uuid();
        const doc = {
            name,
            email,
            secret,
            team: teamId
        };

        return AnnotatorSchema.validate(doc).then(validatedData => {
            return mongoose.model('Annotator').create(validatedData);
        });
    },

    createAnnotators: data => {
        return Promise.map(data, annotator => {
            return AnnotatorController.createAnnotator(annotator.name, annotator.email, annotator.teamId);
        });
    }
};

module.exports = AnnotatorController;
