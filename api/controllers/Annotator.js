const Promise = require('bluebird');
const uuid = require('uuid/v4');
const _ = require('lodash');
const moment = require('moment-timezone');
const { Annotator, validate } = require('../models/Annotator');

const AnnotatorController = {
    create: (name, email, teamId, eventId) => {
        const doc = {
            name,
            email,
            team: teamId,
            event: eventId
        };

        return validate(doc).then(validated => {
            validated.secret = uuid();
            return Annotator.create(validated);
        });
    },

    createMany: data => {
        return Promise.map(data, annotator => {
            return AnnotatorController.create(annotator.name, annotator.email, annotator.team, annotator.event);
        });
    },

    update: (annotatorId, updates) => {
        return Annotator.findByIdAndUpdate(annotatorId, updates, { new: true });
    },

    init: (annotatorId, trackId) => {
        return Annotator.findByIdAndUpdate(
            annotatorId,
            { assigned_track: trackId, read_welcome: true },
            { new: true }
        );
    },

    updateNext: (annotatorId, nextId) => {
        return Annotator.findById(annotatorId).then(annotator => {
            if (!annotator.next) {
                annotator.next = nextId;
            } else {
                annotator.prev = annotator.next;
                annotator.ignore.push(annotator.next);
                annotator.next = nextId;
            }

            annotator.updated = moment().toDate();
            return annotator.save();
        });
    },

    skipCurrent: (annotatorId, nextId) => {
        return Annotator.findById(annotatorId).then(annotator => {
            if (!annotator.next) {
                return Promise.reject('Annotator has no assigned project, cannot skip');
            } else {
                annotator.ignore.push(annotator.next);
                annotator.next = nextId;
                annotator.updated = moment().toDate();
            }

            return annotator.save();
        });
    },

    setReadWelcome: annotatorId => {
        return Annotator.findByIdAndUpdate(annotatorId, { read_welcome: true }, { new: true });
    },

    setOnboarded: annotatorId => {
        return Annotator.findByIdAndUpdate(annotatorId, { onboarded: true }, { new: true });
    },

    enable: annotatorId => {
        return Annotator.findByIdAndUpdate(annotatorId, { active: true }, { new: true });
    },

    disable: annotatorId => {
        return Annotator.findByIdAndUpdate(annotatorId, { active: false }, { new: true });
    },

    getBySecret: secret => {
        return Annotator.findOne({ secret })
            .lean()
            .then(annotator => {
                if (!annotator) {
                    return Promise.reject('No annotator found with the secret ' + secret);
                }

                return annotator;
            });
    },

    getByEmail: email => {
        return Annotator.findOne({ email })
            .lean()
            .then(annotator => {
                if (!annotator) {
                    return Promise.reject('No annotator found with the email ' + email);
                }

                return annotator;
            });
    },

    getById: (_id, includeSecret = true) => {
        return Annotator.findById(_id)
            .lean()
            .then(annotator => {
                if (!annotator) {
                    return Promise.reject('No annotator found with _id ' + _id);
                }

                if (!includeSecret) {
                    annotator.secret = null;
                }

                return annotator;
            });
    },

    getByTeamPublic: (teamId) => {
        return Annotator.find({ team: teamId }).lean().then(annotators => {
            return _.map(annotators, (a) => {
                return AnnotatorController.removeNonPublicFields(a);
            });
        });
    },

    getByEvent: eventId => {
        return Annotator.find({ event: eventId }).lean();
    },

    getManyById: (_ids, includeSecret = false) => {
        return Promise.map(_ids, _id => {
            return AnnotatorController.getById(_id, includeSecret);
        });
    },

    getAll: () => {
        return Annotator.find({});
    },

    getActiveAnnotators: eventId => {
        return Annotator.find({
            event: eventId,
            active: true,
            next: {
                $exists: true
            },
            updated: {
                $exists: true
            }
        });
    },

    deleteById: _id => {
        console.log('DELETING WITH ID', _id);
        return Annotator.findByIdAndDelete(_id);
    },

    setVotedFor: (projectId, annotatorId) => {
        return Annotator.findByIdAndUpdate(annotatorId, { winner_vote: projectId }, { new: true });
    },

    removeNonPublicFields: (annotator) => {
        return {
            ...annotator,
            secret: null,
            alpha: null,
            beta: null,
            winner_vote: null,
            next: null,
            prev: null,
            active: null,
        };
    }
};

module.exports = AnnotatorController;
