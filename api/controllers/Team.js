const { Team, validate } = require('../models/Team');

const TeamController = {
    create: (eventId, teamMembers, contactPhone) => {
        const teamData = {
            event: eventId,
            members: teamMembers,
            contactPhone
        };
        return validate(teamData).then(validated => {
            Team.create({
                ...validated,
                members: []
            }).then(team => {
                //TODO: Create Annotators for each member, create array of their _id's, set that as the team members.
            });
        });
    },

    getAll: () => {
        return Team.find({});
    }
};

module.exports = TeamController;
