const ProjectController = require('../controllers/Project');
const status = require('http-status');
const passport = require('passport');

module.exports = function(app) {
    /* Requires annotator token */
    app.post('/api/projects', passport.authenticate('annotator', { session: false }), createProject);
    /* Requires admin token */

    /* No auth required */
};

function createProject(req, res) {
    ProjectController.update(req.body.project, req.user)
        .then(data => {
            return res.status(status.OK).send({
                status: 'success',
                data
            });
        })
        .catch(error => {
            console.log('ProjectController.create', error);
            return res.status(status.INTERNAL_SERVER_ERROR).send({
                status: 'error'
            });
        });
}
