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
        let teamId = null;
        return validate(teamData).then(validated => {
            let teamId = null;
            return Team.create({
                ...validated,
                members: []
            })
                .then(team => {
                    teamId = team._id;
                    const members = _.map(validated.members, m => {
                        m.event = eventId;
                        m.team = teamId;
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
                        return Promise.map(team.members, annotatorId => {
                            return EmailService.teamMemberAddedEmail(annotatorId, team.event);
                        }).then(() => {
                            return team;
                        }).catch((error) => {
                            console.log('ERROR sending emails', error);
                            return team;
                        })
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
    },

    getMembersById: (teamId) => {
        return Team.findById(teamId).then(team => {
            console.log('TEAM', team);
            return AnnotatorController.getManyById(team.members);
        });
    },
};

module.exports = TeamController;
