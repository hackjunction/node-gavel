const moment = require('moment-timezone');
const _ = require('lodash');
const { Event, validate } = require('../models/Event');
const Utils = require('../services/utils');

const EventController = {
    create: data => {
        return validate(data).then(validated => {
            if (validated.hasOwnProperty('_id')) {
                return Event.findByIdAndUpdate(validated._id, validated, { new: true, setDefaultsOnInsert: true });
            } else {
                return Event.create(validated);
            }
        });
    },

    extendSubmissionDeadline: eventId => {
        return Event.findById(eventId).then(event => {
            if (!event) {
                return Promise.reject('No event found with _id ' + eventId);
            }

            const deadline = moment(event.submissionDeadline)
                .tz(event.timezone)
                .add(15, 'minutes')
                .toDate();

            event.submissionDeadline = deadline;
            return event.save();
        });
    },

    setTrackWinnersPublic: (eventId, public) => {
        return Event.findByIdAndUpdate(eventId, { track_winners_public: public }, { new: true }).then(event => {
            if (!event) {
                return Promise.reject('No event found with _id ' + eventId);
            }

            return event;
        });
    },

    setFinalistVotingOpen: (eventId, open) => {
        return Event.findByIdAndUpdate(eventId, { finalist_voting_open: open }, { new: true }).then(event => {
            if (!event) {
                return Promise.reject('No event found with _id ' + eventId);
            }

            return event;
        })
    },

    getChallengesForEvent: eventId => {
        return Event.findById(eventId).then(event => {
            return _.map(event.challenges, challenge => {
                return {
                    challenge,
                    secret: Utils.encrypt(challenge._id)
                };
            });
        });
    },

    getAll: () => {
        return Event.find({}).lean();
    },

    getEventWithId: _id => {
        return Event.findById(_id)
            .lean()
            .then(event => {
                if (!event) {
                    return Promise.reject('No event found with _id ' + _id);
                }

                return event;
            });
    },

    getEventWithIdPublic: _id => {
        return EventController.getEventWithId(_id).then(event => {
            return EventController.removeNonPublicFields(event);
        })
    },

    getEventWithApiKey: apiKey => {
        return Event.findOne({
            apiKey
        })
            .lean()
            .then(event => {
                if (!event) {
                    return Promise.reject('No event found with api key ' + apiKey);
                }

                return event;
            });
    },

    getChallenge: (eventId, challengeId) => {
        return EventController.getEventWithId(eventId).then(event => {
            const challenge = _.find(event.challenges, (c) => {
                return c._id.toString() === challengeId;
            });

            if (!challenge) {
                return Promise.reject('Event ' + event.name + ' has no challenge with id ' + challengeId);
            }

            return challenge;
        })
    },

    removeNonPublicFields: event => {
        return {
            ...event,
            apiKey: null
        };
    }
};

module.exports = EventController;
