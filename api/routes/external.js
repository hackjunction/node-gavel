const status = require('http-status');
const passport = require('passport');

const TeamController = require('../controllers/Team');

/**
 * Endpoints to be used by external applications with an event API key
 */

module.exports = function(app) {
    /**
     * Get event info
     * -> Requires event API Key
     */
    app.get('/api/external/event', passport.authenticate('apiKey', { session: false }), getEventInfo);

    /**
     * Create a team at an event
     * -> Requires event API Key
     */
    app.post('/api/external/teams/create', passport.authenticate('apiKey', { session: false }), createTeam);

    /**
     * Add a member to a team
     * -> Requires event API Key
     */
    app.post(
        '/api/external/teams/add-member/:teamId',
        passport.authenticate('apiKey', { session: false }),
        addTeamMember
    );

    /**
     * Add a member to a team
     * -> Requires event API Key
     */
    app.post(
        '/api/external/teams/remove-member/:teamId',
        passport.authenticate('apiKey', { session: false }),
        removeTeamMember
    );
};

function getEventInfo(req, res) {
    const event = req.user;

    return res.status(status.OK).send({
        status: 'success',
        data: event
    });
}

function createTeam(req, res) {
    const event = req.user;

    const { members, phoneNumber } = req.body;

    return TeamController.create(event._id.toString(), members, phoneNumber)
        .then(team => {
            return TeamController.getByIdPopulated(team._id.toString()).then(populated => {
                return res.status(status.OK).send({
                    status: 'success',
                    data: populated
                });
            });
        })
        .catch(error => {
            return res.status(status.INTERNAL_SERVER_ERROR).send({
                status: 'error'
            });
        });
}

function addTeamMember(req, res) {
    const { name, email } = req.body;
    const { teamId } = req.params;

    return TeamController.createMember(name, email, teamId).then(newMembers => {
        return res.status(status.OK).send({
            status: 'success',
            data: newMembers
        });
    });
}

function removeTeamMember(req, res) {
    const { annotatorId } = req.body;
    const { teamId } = req.params;

    return TeamController.deleteMember(annotatorId, teamId).then(newMembers => {
        return res.status(status.OK).send({
            status: 'success',
            data: newMembers
        });
    });
}
