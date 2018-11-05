const EventController = require('../controllers/Event');
const status = require('http-status');
const passport = require('passport');

module.exports = function(app) {
    /**
     * Create a new event, or update an existing one
     * -> Requires admin token
     */
    app.post('/api/events', passport.authenticate('admin', { session: false }), createEvent);

    /**
     * Get all events
     * -> Requires admin token
     */
    app.get('/api/events', passport.authenticate('admin', { session: false }), getAllEvents);

    /**
     * Get an event by id
     * -> Requires admin token
     */
    app.get('/api/events/:eventId', passport.authenticate('admin', { session: false }), getEventWithId);

    /**
     * Get an event with the secret code
     * -> No auth required
     */
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
            console.log('createEvent', error);
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
            console.log('getAllEvents', error);
            return res.status(status.INTERNAL_SERVER_ERROR).send({
                status: 'error'
            });
        });
}

function getEventWithId(req, res) {
    EventController.getEventWithId(req.params.eventId)
        .then(data => {
            return res.status(status.OK).send({
                status: 'success',
                data
            });
        })
        .catch(error => {
            console.log('getEventWithId', error);
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
            console.log('getEventWithCode', error);
            return res.status(status.INTERNAL_SERVER_ERROR).send({
                status: 'error'
            });
        });
}
