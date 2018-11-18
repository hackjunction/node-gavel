const Promise = require('bluebird');
const _ = require('lodash');
const { Team, validate } = require('../models/Team');
const AnnotatorController = require('./Annotator');
const EmailService = require('../services/email');
const ObjectId = require('mongodb').ObjectId;

const TeamController = {
    create: (eventId, teamMembers, sendEmail = true) => {
        const teamData = {
            event: eventId,
            members: teamMembers
        };
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
                        })
                            .then(() => {
                                return team;
                            })
                            .catch(error => {
                                console.log('ERROR sending emails', error);
                                return team;
                            });
                    }

                    return team;
                });
        });
    },

    getById: teamId => {
        return Team.findById(teamId)
            .lean()
            .then(team => {
                if (!team) {
                    return Promise.reject('No team found with _id ' + teamId);
                }

                return team;
            });
    },

    getByIdPopulated: teamId => {
        return Team.findById(teamId)
            .populate('members')
            .then(team => {
                if (!team) {
                    return Promise.reject('No team found with _id ' + teamId);
                }

                return team;
            });
    },

    getAll: () => {
        return Team.find({}).lean();
    },

    addMembers: (teamId, annotatorIds) => {
        return Team.findByIdAndUpdate(teamId, { $addToSet: { members: annotatorIds } }, { new: true });
    },

    createMember: (name, email, teamId, sendEmail = true) => {
        return TeamController.getById(teamId)
            .then(team => {
                return AnnotatorController.create(name, email, teamId).then(annotator => {
                    return TeamController.addMembers(teamId, [annotator._id]).then(() => {
                        return {
                            team,
                            annotator
                        };
                    });
                });
            })
            .then(({ team, annotator }) => {
                if (sendEmail) {
                    return EmailService.teamMemberAddedEmail(annotator._id, team.event).then(() => {
                        return team._id;
                    });
                }

                return team._id;
            })
            .then(teamId => {
                return TeamController.getMembersById(teamId);
            });
    },

    deleteMember: (annotatorId, teamId) => {
        return TeamController.getById(teamId)
            .then(team => {
                return TeamController.removeMembers(teamId, [annotatorId]).then(team => {
                    return AnnotatorController.deleteById(annotatorId);
                });
            })
            .then(() => {
                return TeamController.getMembersById(teamId, true);
            });
    },

    removeMembers: (teamId, annotatorIds) => {
        const objectIds = _.map(annotatorIds, id => new ObjectId(id));
        return Team.findByIdAndUpdate(teamId, { $pull: { members: objectIds } }, { new: true });
    },

    getMembersById: (teamId, includeSecret = false) => {
        return Team.findById(teamId)
            .lean()
            .then(team => {
                return AnnotatorController.getManyById(team.members, includeSecret);
            });
    },
    getByEvent: eventId => {
        return Team.find({ event: eventId }).lean();
    }
};

module.exports = TeamController;
