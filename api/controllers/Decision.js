const _ = require('lodash');
const moment = require('moment-timezone');
const { Decision, validate } = require('../models/Decision');

const EventController = require('../controllers/Event');

const DecisionController = {
    create: (annotatorId, eventId, winnerId, loserId) => {
        const doc = {
            annotator: annotatorId,
            event: eventId,
            winner: winnerId,
            loser: loserId
        };

        return EventController.getEventWithId(eventId).then(event => {
            doc.timestamp = moment()
                .tz(event.timezone)
                .toDate();
            return validate(doc).then(validated => {
                return Decision.create(validated);
            });
        });
    }
};

module.exports = DecisionController;
