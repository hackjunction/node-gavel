const Promise = require('bluebird');
const uuid = require('uuid/v4');
const _ = require('lodash');
const moment = require('moment-timezone');
const { ChallengeWinners, validate } = require('../models/ChallengeWinners');
const EventController = require('../controllers/Event');

const ChallengeWinnersController = {



	createOrUpdate: (challengeId, eventId, data) => {
		const d = {
			...data,
			event: eventId,
			challenge: challengeId,
		};

		return EventController.getChallenge(eventId, challengeId).then(() => {
			return validate(d).then(validatedData => {
				validatedData.updated = moment().toDate();
				if (d.hasOwnProperty('_id')) {
					return ChallengeWinners.findByIdAndUpdate(data._id, validatedData, { new: true });
				} else {
					return ChallengeWinners.create(validatedData);
				}
			});
		});
	},

	getByEvent: (eventId) => {
		return ChallengeWinners.find({ event: eventId });
	},

	getByChallenge: (challengeId) => {
		return ChallengeWinners.findOne({ challenge: challengeId });
	},
};

module.exports = ChallengeWinnersController;