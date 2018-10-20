const { Event, validate } = require('../models/Event');

const EventController = {
  create: data => {
    return validate(data).then(validated => {
      return Event.create(validated);
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

  removeNonPublicFields: event => {
    return {
      ...event,
      apiKey: null
    };
  }
};

module.exports = EventController;
