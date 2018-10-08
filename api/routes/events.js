const EventController = require('../controllers/Event');
const status = require('http-status');
const passport = require('passport');

module.exports = function(app) {
    /* Requires admin token */
    app.post('/api/events', passport.authenticate('token', { session: false }), createEvent);
};

function createEvent(req, res) {
    EventController.create(req.body.event)
        .then(data => {
            return res.status(status.OK).send({
                status: 'success',
                data
            });
        })
        .catch(error => {
            return res.status(status.INTERNAL_SERVER_ERROR).send({
                status: 'error'
            });
        });
}
