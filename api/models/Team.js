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
    secret: {
        type: String
    }
});
// Members are not defined here, but each Annotator has a property teamId for that

const Team = mongoose.model('Team', TeamSchema);

//TODO: Validation of new team
//TODO: "Class methods";
module.exports = {
    Team
};
