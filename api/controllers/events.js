const Joi = require('joi');
const mongoose = require('mongoose');
const Promise = require('bluebird');

const EventSchema = Joi.object().keys({
    name: Joi.string().required(),
    secretCode: Joi.string()
        .min(10)
        .max(30)
        .required()
});

const EventController = {
    createEvent: (name, secretCode) => {
        const doc = {
            name,
            secretCode
        };

        return EventSchema.validate(doc).then(validatedData => {
            return mongoose.model('Event').create(validatedData);
        });
    },

    getEventWithCode: secretCode => {
        return mongoose
            .model('Event')
            .findOne({ secretCode })
            .then(event => {
                if (!event) {
                    return Promise.reject(new Error('No event found with code ' + secretCode));
                }

                return Promise.resolve(event);
            });
    }
};

module.exports = EventController;
