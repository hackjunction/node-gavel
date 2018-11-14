const { Event, validate } = require('../models/Event');

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

    getAll: () => {
        return Event.find({}).lean();
    },

    getEventWithCode: participantCode => {
        return Event.findOne({ participantCode })
            .lean()
            .then(event => {
                if (!event) {
                    return Promise.reject('No event found with code ' + participantCode);
                }

                return event;
            });
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

    removeNonPublicFields: event => {
        return {
            ...event,
            apiKey: null
        };
    }
};

module.exports = EventController;
