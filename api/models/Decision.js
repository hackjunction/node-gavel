'use strict';
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Joi = require('joi');
const Promise = require('bluebird');
const uuid = require('uuid/v4');

const DecisionSchema = new Schema({

  annotator: {
    type: Schema:types.ObjectId,
    ref: 'Annotator',
    required: true
  },

  winner: {
    type: Schema:types.ObjectId,
    ref: 'Item',
    required: true
  },

  loser: {
    type: Schema:types.ObjectId,
    ref: 'Item',
    required: true
  },

  time: {
    type: Date,
    default: Date.now,
  }
})

const Decision = mongoose.model('Decision', DecisionSchema)

module.exports = {
  Decision
}
