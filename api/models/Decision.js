'use strict';
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const DecisionSchema = new Schema({
    annotator: {
        type: Schema.Types.ObjectId,
        ref: 'Annotator',
        required: true
    },

    event: {
        type: Schema.Types.ObjectId,
        ref: 'Event',
        required: true
    },

    winner: {
        type: Schema.Types.ObjectId,
        ref: 'Project',
        required: true
    },

    loser: {
        type: Schema.Types.ObjectId,
        ref: 'Project',
        required: true
    },

    time: {
        type: Date,
        default: Date.now
    }
});

const Decision = mongoose.model('Decision', DecisionSchema);

// Creates a new decision, returns promise
// No validation needed, all fields are references
const create = function(annotator, winner, loser) {
    const decision = new Decision({
        annotator,
        winner,
        loser
    });

    return decision.save();
};

module.exports = {
    Decision,
    create
};
