'use strict';

const status = require('http-status');
const EventController = require('../controllers/events');

module.exports = function(app) {
    // Find an event with it's secret code
    app.route('/api/events/code/:code').get(getEventWithCode);
};

function getEventWithCode(req, res) {
    return EventController.getEventWithCode(req.params.code)
        .then(event => {
            return res.status(status.OK).send({
                status: 'success',
                data: event
            });
        })
        .catch(error => {
            return res.status(status.NOT_FOUND).send({
                status: 'error',
                message: error.message
            });
        });
}
