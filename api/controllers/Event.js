const { Event, validate } = require('../models/Event');
const moment = require('moment-timezone');

const DATE_FORMAT = 'DD.MM.YYYY HH:mm';

const EventController = {
    create: data => {
        return validate(data).then(validated => {
            return Event.create(validated);
        });
    },

    getAll: () => {
        return Event.find({});
    }
};

module.exports = EventController;
