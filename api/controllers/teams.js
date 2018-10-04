const Joi = require('joi');
const uuid = require('uuid/v4');
const mongoose = require('mongoose');

const TeamSchema = Joi.object().keys({
    event: Joi.string(),
    secret: Joi.string().guid({
        version: ['uuidv4']
    })
});

const TeamController = {
    createTeam: eventId => {
        return mongoose
            .model('Event')
            .findById(eventId)
            .then(event => {
                if (!event) {
                    throw new Error('No event found with id ' + eventId);
                }

                const doc = {
                    event: event._id.toString(),
                    secret: uuid()
                };

                return TeamSchema.validate(doc);
            })
            .then(validatedTeam => {
                return mongoose.model('Team').create(validatedTeam);
            });
    }
};

module.exports = TeamController;
