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

    getByApiKey: (id) => {
        return Event.findOne({apiKey: id})
    },

    updateByApiKey: data => {
        const eventInfo = data
        delete eventInfo._id
        delete eventInfo.__v
        return validate(eventInfo).then(validated => {
            return Event.findOneAndUpdate({apiKey: validated.apiKey}, validated, {new: true, upsert: true})
        })
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
