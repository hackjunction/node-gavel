'use strict';
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Joi = require('joi');

const TeamSchema = new Schema({
    event: {
        type: Schema.Types.ObjectId,
        ref: 'Event'
    },
    members: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Annotator'
        }
    ]
});

const Team = mongoose.model('Team', TeamSchema);

const validate = data => {
    const schema = Joi.object().keys({
        event: Joi.string(),
        members: Joi.array().items(
            Joi.object().keys({
                name: Joi.string().trim(),
                email: Joi.string().trim()
            })
        )
    });

    return schema.validate(data);
};

module.exports = {
    Team,
    validate
};
