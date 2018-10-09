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
    }
};

module.exports = EventController;
