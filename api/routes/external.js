const status = require('http-status');
const passport = require('passport');
const Joi = require('joi');

const TeamController = require('../controllers/Team');

/**
 * Endpoints to be used by external applications with an event API key
 */

module.exports = function (app) {
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
     * Remove a member from a team
     * -> Requires event API Key
     */
    app.post(
        '/api/external/teams/remove-member/:teamId',
        passport.authenticate('apiKey', { session: false }),
        removeTeamMember
    );

    /**
     * Update team members
     * -> Requires event API Key
     * -> supply @members, an array of the correct members a team should have. Each member must have @name and @email fields.
     * -> If a member also contains an @_id field, check that any duplicates are removed and only the one with that if remains.
     * -> If a member does not contain @_id, create a new member with the name and email provided
     *
     * Returns the resulting updated list of team members
     */
    app.post(
        '/api/external/teams/update-members/:teamId',
        passport.authenticate('apiKey', { session: false }),
        updateTeamMembers,
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

    const { members } = req.body;

    return TeamController.create(event._id.toString(), members)
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

    return TeamController.createMember(name, email, teamId)
        .then(newMembers => {
            return res.status(status.OK).send({
                status: 'success',
                data: newMembers
            });
        })
        .catch(error => {
            console.log('addTeamMember', error);

            return res.status(status.INTERNAL_SERVER_ERROR).send({
                status: 'error'
            });
        });
}

function removeTeamMember(req, res) {
    const { annotatorId } = req.body;
    const { teamId } = req.params;

    return TeamController.deleteMember(annotatorId, teamId)
        .then(newMembers => {
            return res.status(status.OK).send({
                status: 'success',
                data: newMembers
            });
        })
        .catch(error => {
            console.log('removeTeamMember', error);

            return res.status(status.INTERNAL_SERVER_ERROR).send({
                status: 'error'
            });
        });
}

function updateTeamMembers(req, res) {
  console.log("update members called")
    const { teamId } = req.params;
    const { members } = req.body;

    const schema = Joi.object().keys({
      'members': Joi.array().items(Joi.object().keys(
        {
          name: Joi.string().required(),
          email: Joi.string().required(),
          _id: Joi.string().optional()
        }
      )).min(1).max(6).required(),
      'key': Joi.string().optional()
    }, { allowUnknown: false })

    return schema.validate(req.body).then((validatedMembers) => {
        return TeamController.updateMembers(members, teamId).then((newMembers) => {
            return res.status(status.OK).send({
                status: 'success',
                data: newMembers
            });
        }).catch(error => {
            console.log('updateTeamMembers', error);

            return res.status(status.INTERNAL_SERVER_ERROR).send({
                status: 'error'
            });
        });
    }).catch(error => {
        console.log('BAD REQUEST, updateTeamMembers', error);
        return res.status(status.BAD_REQUEST).send({
            status: 'error'
        });
    });
}
