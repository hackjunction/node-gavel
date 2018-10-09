'use strict';
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

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
    ],
    contactPhone: {
        type: String
    }
});

const Team = mongoose.model('Team', TeamSchema);

const validate = data => {
    const schema = Joi.object().keys({
        event: Joi.string(),
        members: Joi.array().items(
            Joi.object().keys({
                name: Joi.string(),
                email: Joi.string()
            })
        ),
        contactPhone: Joi.string().phone()
    });

    return schema.validate(cleaned);
};

//TODO: Validation of new team
//TODO: "Class methods";
module.exports = {
    Team,
    validate
};
