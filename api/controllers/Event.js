const { Event, validate } = require('../models/Event');

const EventController = {
    create: data => {
        return validate(data).then(validated => {
            return Event.create(validated);
        });
    }
};

module.exports = EventController;
