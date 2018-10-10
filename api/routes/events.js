const EventController = require('../controllers/Event');
const status = require('http-status');
const passport = require('passport');

module.exports = function(app) {
    /* Requires admin token */
    app.post('/api/events', passport.authenticate('admin', { session: false }), createEvent);
    app.get('/api/events', passport.authenticate('admin', { session: false }), getAllEvents);

    /* No auth required */
    app.get('/api/events/code/:code', getEventWithCode);
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
            console.log('EventController.create', error);
            return res.status(status.INTERNAL_SERVER_ERROR).send({
                status: 'error'
            });
        });
}

function getAllEvents(req, res) {
    EventController.getAll()
        .then(data => {
            return res.status(status.OK).send({
                status: 'success',
                data
            });
        })
        .catch(error => {
            console.log('EventController.getAllEvents', error);
            return res.status(status.INTERNAL_SERVER_ERROR).send({
                status: 'error'
            });
        });
}

function getEventWithCode(req, res) {
    EventController.getEventWithCode(req.params.code)
        .then(data => {
            return res.status(status.OK).send({
                status: 'success',
                data
            });
        })
        .catch(error => {
            console.log('EventController.getEventWithCode', error);
            return res.status(status.INTERNAL_SERVER_ERROR).send({
                status: 'error'
            });
        });
}
