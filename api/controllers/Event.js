const { Event, validate } = require('../models/Event');

const EventController = {
    create: data => {
        return validate(data).then(validated => {
            return Event.create(validated);
        });
    },

    getAll: () => {
        return Event.find({});
    },

    getEventWithCode: participantCode => {
        return Event.findOne({ participantCode }).then(event => {
            if (!event) {
                return Promise.reject('No event found with code ' + participantCode);
            }

            return event;
        });
    },

    getEventWithId: _id => {
        return Event.findById(_id).then(event => {
            if (!event) {
                return Promise.reject('No event found with _id ' + _id);
            }

            return event;
        })
    },
};

module.exports = EventController;
