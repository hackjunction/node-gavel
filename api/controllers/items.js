const Joi = require('joi');
const Promise = require('bluebird');
const mongoose = require('mongoose');

const ItemSchema = Joi.object().keys({
    name: Joi.string()
        .min(1)
        .max(120)
        .required(),
    description: Joi.string().max(1000),
    location: Joi.string()
        .alphanum()
        .min(1)
        .max(5)
        .required(),
    team: Joi.string().required()
});

const ItemController = {
    createItem: (name, location, description, teamId) => {
        const doc = {
            name,
            location,
            description,
            team: teamId
        };

        return ItemSchema.validate(doc).then(validatedData => {
            return mongoose.model('Item').create(validatedData);
        });
    },

    createItems: data => {
        return Promise.map(data, item => {
            return ItemController.createItem(item.name, item.location, item.description, item.team);
        });
    }
};

module.exports = ItemController;
