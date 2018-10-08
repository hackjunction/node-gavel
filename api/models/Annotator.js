'use strict';
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Joi = require('joi');
const Promise = require('bluebird');
const uuid = require('uuid/v4');

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
    alpha: {
        type: Number,
        default: 10.0
    },
    beta: {
        type: Number,
        default: 1.0
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
        teamId: Joi.any()
    });

    return new Promise(function(resolve, reject) {
        Joi.validate(annotator, schema, function(err, value) {
            if (err !== null) {
                return reject(err.details);
            }

            return resolve(value);
        });
    });
};

/* Creates a new Annotator, returns promise */
const create = function(data) {
    return validate(data).then(validatedData => {
        const annotator = new Annotator(validatedData);
        annotator.secret = uuid();
        return annotator.save();
    });
};
/* Get all annotators, returns promise */
const getAll = function() {
    return Annotator.find({});
};

const getByTeamId = function(teamId, throwsError = true) {
    return Annotator.find({ teamId }).then(annotators => {
        if (throwsError && !annotators) {
            return Promise.reject('No annotator found with teamId: ' + teamId);
        }
        return Promise.resolve(annotators);
    });
};

/* Find an annotator by theirs id, returns promise */
const findById = function(id, throwsError = true) {
    return Annotator.findById(id).then(annotator => {
        if (throwsError && !annotator) {
            return Promise.reject('No annotator found with id: ' + id);
        }
        return Promise.resolve(annotator);
    });
};

/* Find an annotator by their secret, return promise */
const findBySecret = function(secret, throwsError = true) {
    return Annotator.findOne({ secret }).then(annotator => {
        if (throwsError && !annotator) {
            return Promise.reject('No annotator found with secret: ' + secret);
        }
        return Promise.resolve(annotator);
    });
};

/* Delete an annotator by their id, returns promise */
const deleteById = function(id, throwsError = true) {
    return Annotator.findByIdAndRemove(id)
        .exec()
        .then(annotator => {
            if (throwsError && !annotator) {
                return Promise.reject('No annotator found with id: ' + id);
            }
            return Promise.resolve(annotator);
        });
};

/* Delete an annotator by their secret, returns promise */
const deleteBySecret = function(secret, throwsError = true) {
    return Annotator.findOneAndDelete({ secret })
        .exec()
        .then(annotator => {
            if (throwsError && !annotator) {
                return Promise.reject('No annotator found with secret: ' + secret);
            }
            return Promise.resolve(annotator);
        });
};

/* Sets the annotator read_welcome to true */
const setHasReadWelcome = function(secret, throwsError = true) {
    return Annotator.findOneAndUpdate({ secret }, { read_welcome: true }, { new: true }).then(annotator => {
        if (throwsError && !annotator) {
            return Promise.reject('No annotator found with secret: ' + secret);
        }

        return Promise.resolve(annotator);
    });
};

module.exports = {
    Annotator,
    validate,
    create,
    getAll,
    findById,
    findBySecret,
    deleteById,
    deleteBySecret,
    setHasReadWelcome,
    getByTeamId
};
