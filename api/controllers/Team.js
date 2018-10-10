const Promise = require('bluebird');
const _ = require('lodash');
const { Team, validate } = require('../models/Team');
const AnnotatorController = require('./Annotator');
const EmailService = require('../services/email');

const TeamController = {
    create: (eventId, teamMembers, contactPhone, sendEmail = true) => {
        const teamData = {
            event: eventId,
            members: teamMembers,
            contactPhone
        };
        return validate(teamData).then(validated => {
            let teamId = null;
            return Team.create({
                ...validated,
                members: []
            })
                .then(team => {
                    const members = _.map(validated.members, m => {
                        m.event = eventId;
                        return m;
                    });
                    return AnnotatorController.createMany(members);
                })
                .then(annotators => {
                    const ids = _.map(annotators, '_id');
                    return TeamController.addMembers(teamId, ids);
                })
                .then(team => {
                    if (sendEmail) {
                        let context = {
                            team,
                            event: {
                                _id: teamData.event,
                                link: 'https://2018.heckjunction.com'
                            }
                        };
                        EmailService.sendAll('create-team', team.members, context)
                            .then(() => {
                                console.log('Sent message to team ' + team._id);
                            })
                            .catch(e => {
                                console.log('Error sending emails to team ' + team._id);
                            });
                    }

                    return team;
                });
        });
    },

    getAll: () => {
        return Team.find({});
    },

    addMembers: (teamId, annotatorIds) => {
        return Team.findByIdAndUpdate(teamId, { $addToSet: { members: annotatorIds } }, { new: true });
    },

    removeMembers: (teamId, annotatorIds) => {
        return Team.findByIdAndUpdate(teamId, { $pull: { members: annotatorIds } }, { new: true });
    }
};

module.exports = TeamController;
